import csv
from data.firebase import db
from models.question import WouldYouRatherQuestion
import sys
import time

# Define the path to the CSV file
csv_file_path = "data/would_you_rather/all_unique.csv"

# Get total number of rows in CSV file
with open(csv_file_path, "r") as file:
    total_rows = sum(1 for _ in file)-1

# Read the CSV file and add entries to the database
with open(csv_file_path, "r") as file:
    reader = csv.DictReader(file)
    for i, row in enumerate(reader, start=1):
        # Extract data from each row
        option_a = row["option_a"]
        votes_a = int(row["votes_a"])
        option_b = row["option_b"]
        votes_b = int(row["votes_b"])

        # Create WouldYouRatherQuestion object
        question = WouldYouRatherQuestion(option1=option_a, option2=option_b)

        # Add questions to the database
        doc_ref = db.collection("would_you_rather").add(question.model_dump())[1]

        # Clear the previous progress message
        sys.stdout.write("\r")
        sys.stdout.flush()

        # Calculate progress percentage
        progress = i / total_rows * 100

        # Print progress message
        sys.stdout.write(f"Progress: {progress:.2f}% ({i}/{total_rows})")
        sys.stdout.flush()

        # Add a small delay to simulate processing time
        time.sleep(0.1)

print("\nAll entries added successfully!")
