from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import create_engine, func, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List, Optional

DATABASE_URL = "postgres://postgres:0710@localhost:5432/btp"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(expire_on_commit = False, autoflush = False, bind=engine )
Base = declarative_base()

router = APIRouter(
    prefix="/data_analysis"
)

# SQLAlchemy Model
class Trend(Base):
    __tablename__ = "trends"
    patient_id = Column(String, index=True)
    metric_name = Column(String, index=True)
    metric_value = Column(Float)
    recorded_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Model for Response
class MetricDataPoint(BaseModel):
    patient_id: str
    metricvalue: float
    recorded_at: datetime

class MetricTimeSeriesResponse(BaseModel):
    metric_name: str
    patient_id: str
    data_points: List[MetricDataPoint]
    summary: dict

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/metrics/time-series", response_model=MetricTimeSeriesResponse)
def get_metric_time_series(
    metric_name: Optional[str],
    patient_id: str = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(get_db)
):
    # Base query
    query = db.query("Trend").filter(Trend.patient_id == patient_id)
    
    # Optional patient filter
    if metric_name:
        query = query.filter(Trend.metric_name == metric_name)
    
    # Optional date range filter
    if start_date:
        query = query.filter(Trend.recorded_at >= start_date)
    if end_date:
        query = query.filter(Trend.recorded_at <= end_date)
    
    # Order by recorded time
    query = query.order_by(Trend.recorded_at)
    
    # Execute query
    metric_data = query.all()
    
    if not metric_data:
        raise HTTPException(status_code=404, detail="No data found")
    
    # Prepare data points
    data_points = [
        MetricDataPoint(
            patient_id=entry.patient_id,
            metricvalue=entry.metricvalue,
            recorded_at=entry.recorded_at
        ) for entry in metric_data
    ]
    
    # Calculate summary statistics
    summary = {
        'total_records': len(data_points),
        'min_value': min(dp.metricvalue for dp in data_points),
        'max_value': max(dp.metricvalue for dp in data_points),
        'avg_value': sum(dp.metricvalue for dp in data_points) / len(data_points),
        'date_range': {
            'start': data_points[0].recorded_at,
            'end': data_points[-1].recorded_at
        }
    }
    
    return {
        'metric_name': metric_name,
        'patient_id': patient_id or 'all_patients',
        'data_points': data_points,
        'summary': summary
    }