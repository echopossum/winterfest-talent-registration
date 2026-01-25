CREATE TYPE "public"."roles" AS ENUM('admin', 'judge', 'guest');--> statement-breakpoint
CREATE TABLE "registrant" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone_number" varchar NOT NULL,
	"additional_members" varchar,
	"unit_type" varchar,
	"unitNumber" integer NOT NULL,
	"description" varchar,
	"performed" boolean DEFAULT false NOT NULL,
	CONSTRAINT "registrant_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "score" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant" integer NOT NULL,
	"originality" integer NOT NULL,
	"entertainment_value" integer NOT NULL,
	"audience_appeal" integer NOT NULL,
	"skill_level" integer NOT NULL,
	"aesthetic_appeal" integer NOT NULL,
	"judges_choice" integer DEFAULT 0 NOT NULL,
	"comment" varchar
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_name" varchar NOT NULL,
	"role" "roles",
	"password" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "score" ADD CONSTRAINT "score_participant_registrant_id_fk" FOREIGN KEY ("participant") REFERENCES "public"."registrant"("id") ON DELETE cascade ON UPDATE no action;