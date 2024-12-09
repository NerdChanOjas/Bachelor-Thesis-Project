import { char, date, integer, pgTable, timestamp, uuid, varchar, jsonb } from "drizzle-orm/pg-core";

export const usersTable = pgTable("Users", {
    user_id: varchar().primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    type: char(),
    password_hashed: varchar(),
    phone: varchar({length: 10}),
    gender: char({length: 1}),
    dob: date({ mode: "date" }),
    updated_at: timestamp({ mode: "date" }),
    created_at: timestamp({ mode: "date" }).defaultNow().notNull(),
});

export const patientTable = pgTable("Patient", {
    patient_id: varchar().primaryKey(),
    user_id: varchar().references(() => usersTable.user_id),
    blood_group: varchar().notNull(),
    allergies: varchar(),
    chronic_conditions: char(),
    emergeny_contact: varchar(),
    address: varchar()
});

export const doctorTable = pgTable("Doctor", {
    doctor_id: varchar().primaryKey(),
    user_id: varchar().references(() => usersTable.user_id),
    license_number: varchar(),
    specialization: char(),
    experience: integer()
});

export const providerTable = pgTable("Provider", {
    provider_id: varchar().primaryKey(),
    user_id: varchar().references(() => usersTable.user_id),
    category: char()
});

export const medicalRecordTable = pgTable("MedicalRecord", {
    record_id: varchar().primaryKey(),
    patient_id: varchar().references(() => patientTable.patient_id),
    uploaded_by: char(),
    record_type: char(),
    file_url: varchar(),
    description: varchar(),
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull()
});

export const medicalRecordMetadataTable = pgTable("MetadataRecord", {
    record_id: varchar().references(() => medicalRecordTable.record_id),
    embedded_vector: jsonb(),
    keyword: jsonb(),
});

export const trendsTable = pgTable("Trends", {
    patient_id: varchar().references(() => patientTable.patient_id),
    metric_name: char(),
    metric_value: varchar(),
    recorded_at: timestamp()
});

export const chatLogTable = pgTable("ChatLog", {
    user_id: varchar().references(() => usersTable.user_id),
    chat: jsonb(),
    created_at: timestamp()
});