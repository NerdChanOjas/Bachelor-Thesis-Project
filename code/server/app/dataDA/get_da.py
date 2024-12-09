from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from typing import List, Dict, Any
import pandas as pd
import json
from transformers import pipeline
from fastapi import APIRouter, HTTPException


DATABASE_URL = "postgres://postgres:0710@localhost:5432/btp"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(expire_on_commit = False, autoflush = False, bind=engine )
Base = declarative_base()

router = APIRouter(
    prefix="/data_analysis"
)

class MedicalMetricsInsightGenerator:

    def _prepare_medical_data(self, metric_name: str, patient_id: str) -> pd.DataFrame:
        session = SessionLocal()
        try:
            # Retrieve data for specific metric
            query = f"""
            SELECT patient_id, metricvalue, recorded_at 
            FROM trends 
            WHERE patient_id = '{patient_id}' AND metric_name = '{metric_name}'
            """
            df = pd.read_sql(query, session.bind)
            return df
        finally:
            session.close()

    def _generate_medical_narrative(prompt: str):
        medical_nlp = pipeline("text-generation", model="microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract")
        narrative = medical_nlp(prompt, max_length=250)[0]['generated_text']
    
        return narrative

    def generate_narrative_insights(self, patient_id: str, time_period: str = 'last_30_days') -> str:
        # Retrieve and process data
        df_heart_rate = self._prepare_medical_data("heart_rate")
        df_spo2 = self._prepare_medical_data("spo2")
        
        # Prepare statistical summary
        summary_stats_heart_rate = {
            'mean': df_heart_rate['metricvalue'].mean(),
            'median': df_heart_rate['metricvalue'].median(),
            'std_dev': df_heart_rate['metricvalue'].std(),
            'min': df_heart_rate['metricvalue'].min(),
            'max': df_heart_rate['metricvalue'].max(),
            'total_patients': df_heart_rate['patient_id'].nunique(),
            'metric_name': "heart_rate"
        }

        summary_stats_spo2 = {
            'mean': df_spo2['metricvalue'].mean(),
            'median': df_spo2['metricvalue'].median(),
            'std_dev': df_spo2['metricvalue'].std(),
            'min': df_spo2['metricvalue'].min(),
            'max': df_spo2['metricvalue'].max(),
            'total_patients': df_spo2['patient_id'].nunique(),
            'metric_name': "spo2"
        }

        # Construct prompt for LLM
        prompt = f"""
        Analyze the following medical metric data which is from {time_period} and generate a professional, 
        medical-grade narrative insight:

        Metric: "heart_rate"
        Statistical Summary:
        {json.dumps(summary_stats_heart_rate, indent=2)}

        Metric: "spo2"
        Statistical Summary:
        {json.dumps(summary_stats_spo2, indent=2)}

        Please provide:
        1. An overview of the metric's distribution
        2. Any notable patterns or trends
        3. Potential clinical implications
        4. Recommended next steps for medical professionals

        Respond in a clear, concise, and professional medical tone.
        """
        
        result = self._generate_medical_narrative(prompt)

        return result

@router.post("/generate-analysis")
async def generate_analysis(request):
    try:
        patient_id = request.patient_id.strip()
        if (patient_id == ""):
            raise HTTPException(status_code=400, detail="Patient ID is missing.")
        
        insight_generator = MedicalMetricsInsightGenerator()

        insight = insight_generator.generate_narrative_insights(patient_id=patient_id, time_period="last_4_days")

        return {
            "message": "Result analysed",
            "result": insight
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")