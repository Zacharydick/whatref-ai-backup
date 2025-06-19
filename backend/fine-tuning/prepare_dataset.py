#!/usr/bin/env python3
"""
Watch Identification Fine-Tuning Dataset Preparation
Prepares JSONL dataset for OpenAI vision fine-tuning
"""

import json
import os
import requests
import base64
from typing import List, Dict
import csv

class WatchDatasetPreparer:
    def __init__(self):
        self.dataset = []
        self.system_prompt = "You are an expert watch identifier specializing in luxury timepieces and reference numbers."
    
    def add_watch_entry(self, image_path: str, reference_number: str, brand: str, 
                       model: str, case_size: str, year: str, material: str):
        """Add a single watch entry to the dataset"""
        
        # Convert image to base64 or URL
        if image_path.startswith('http'):
            image_content = {
                "type": "image_url",
                "image_url": {"url": image_path}
            }
        else:
            # Convert local image to base64
            with open(image_path, 'rb') as img_file:
                img_data = base64.b64encode(img_file.read()).decode('utf-8')
                image_content = {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{img_data}"}
                }
        
        # Format the expected response
        response_text = f"""Reference Number: {reference_number}
Brand: {brand}
Model: {model}
Case Size: {case_size}
Year: {year}
Material: {material}"""
        
        entry = {
            "messages": [
                {
                    "role": "system",
                    "content": self.system_prompt
                },
                {
                    "role": "user",
                    "content": "Identify this watch and provide its reference number and specifications."
                },
                {
                    "role": "user",
                    "content": [image_content]
                },
                {
                    "role": "assistant",
                    "content": response_text
                }
            ]
        }
        
        self.dataset.append(entry)
    
    def load_from_csv(self, csv_file: str):
        """Load watch data from CSV file"""
        with open(csv_file, 'r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                self.add_watch_entry(
                    image_path=row['image_path'],
                    reference_number=row['reference_number'],
                    brand=row['brand'],
                    model=row['model'],
                    case_size=row['case_size'],
                    year=row['year'],
                    material=row['material']
                )
    
    def save_jsonl(self, output_file: str):
        """Save dataset in JSONL format for OpenAI fine-tuning"""
        with open(output_file, 'w') as file:
            for entry in self.dataset:
                file.write(json.dumps(entry) + '\n')
        
        print(f"Dataset saved: {len(self.dataset)} entries in {output_file}")
    
    def validate_dataset(self):
        """Validate dataset format and content"""
        errors = []
        
        for i, entry in enumerate(self.dataset):
            # Check required fields
            if 'messages' not in entry:
                errors.append(f"Entry {i}: Missing 'messages' field")
                continue
            
            messages = entry['messages']
            if len(messages) != 4:
                errors.append(f"Entry {i}: Expected 4 messages, got {len(messages)}")
            
            # Check for assistant response
            assistant_msg = None
            for msg in messages:
                if msg.get('role') == 'assistant':
                    assistant_msg = msg
                    break
            
            if not assistant_msg:
                errors.append(f"Entry {i}: Missing assistant response")
            elif 'Reference Number:' not in assistant_msg.get('content', ''):
                errors.append(f"Entry {i}: Invalid assistant response format")
        
        if errors:
            print("Dataset validation errors:")
            for error in errors:
                print(f"  - {error}")
            return False
        else:
            print(f"Dataset validation passed: {len(self.dataset)} entries")
            return True

# Example usage and sample data
def create_sample_dataset():
    """Create a sample dataset with example watches"""
    
    preparer = WatchDatasetPreparer()
    
    # Sample data (replace with real data)
    sample_watches = [
        {
            'image_path': 'https://example.com/rolex-submariner-116610ln.jpg',
            'reference_number': '116610LN',
            'brand': 'Rolex',
            'model': 'Submariner',
            'case_size': '40mm',
            'year': '2010-2020',
            'material': 'Stainless Steel'
        },
        {
            'image_path': 'https://example.com/omega-speedmaster-311.jpg',
            'reference_number': '311.30.42.30.01.005',
            'brand': 'Omega',
            'model': 'Speedmaster Professional',
            'case_size': '42mm',
            'year': '2014+',
            'material': 'Stainless Steel'
        },
        # Add more sample entries...
    ]
    
    for watch in sample_watches:
        preparer.add_watch_entry(**watch)
    
    return preparer

if __name__ == "__main__":
    # Create sample dataset
    preparer = create_sample_dataset()
    
    # Validate and save
    if preparer.validate_dataset():
        preparer.save_jsonl('watch_training_data.jsonl')
        print("Sample dataset created successfully!")
    
    # Print instructions
    print("\nNext steps:")
    print("1. Collect high-quality watch images with verified reference numbers")
    print("2. Create a CSV file with columns: image_path, reference_number, brand, model, case_size, year, material")
    print("3. Run: preparer.load_from_csv('your_watch_data.csv')")
    print("4. Upload to OpenAI and start fine-tuning job") 