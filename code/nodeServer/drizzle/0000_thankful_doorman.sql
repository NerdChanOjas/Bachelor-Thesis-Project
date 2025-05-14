CREATE TABLE IF NOT EXISTS "ChatLog" (
	"user_id" varchar,
	"chat" jsonb,
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Doctor" (
	"doctor_id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"license_number" varchar,
	"specialization" char,
	"experience" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MetadataRecord" (
	"record_id" varchar,
	"embedded_vector" jsonb,
	"keyword" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MedicalRecord" (
	"record_id" varchar PRIMARY KEY NOT NULL,
	"patient_id" varchar,
	"uploaded_by" char,
	"record_type" char,
	"file_url" varchar,
	"description" varchar,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Patient" (
	"patient_id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"blood_group" varchar NOT NULL,
	"allergies" varchar,
	"chronic_conditions" char,
	"emergeny_contact" varchar,
	"address" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Provider" (
	"provider_id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar,
	"category" char
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Trends" (
	"patient_id" varchar,
	"metric_name" char,
	"metric_value" varchar,
	"recorded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"user_id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"type" char,
	"password_hashed" varchar,
	"phone" varchar(10),
	"gender" char(1),
	"dob" date,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ChatLog" ADD CONSTRAINT "ChatLog_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MetadataRecord" ADD CONSTRAINT "MetadataRecord_record_id_MedicalRecord_record_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."MedicalRecord"("record_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patient_id_Patient_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Patient" ADD CONSTRAINT "Patient_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Provider" ADD CONSTRAINT "Provider_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Trends" ADD CONSTRAINT "Trends_patient_id_Patient_patient_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("patient_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
