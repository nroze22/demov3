export const extractionPrompts = {
  patient: `Extract patient demographic information with high accuracy. Focus on:

1. Personal Information
   - First and last name
   - Date of birth
   - Gender
   - Contact details

2. Insurance Information
   - Provider name
   - Policy number
   - Group number if available

3. Medical History
   - Chronic conditions
   - Previous surgeries
   - Current medications
   - Allergies

4. Contact Information
   - Address
   - Phone numbers
   - Email
   - Emergency contact

Return ONLY valid JSON matching the specified structure.
Include confidence scores (0-1) for each extracted field.`,

  medications: `Extract medication information with high accuracy. Focus on:

1. Medication Details
   - Name (generic and brand)
   - Dosage and frequency
   - Route of administration
   - Start/end dates

2. Prescriber Information
   - Name
   - Specialty
   - Contact information

3. Pharmacy Details
   - Name
   - Location
   - Contact information

Return ONLY valid JSON matching the specified structure.
Include confidence scores (0-1) for each extracted field.`,

  allergies: `Extract allergy information with high accuracy. Focus on:

1. Allergy Details
   - Allergen name
   - Reaction type
   - Severity
   - Date identified

2. Treatment Information
   - Emergency medications
   - Action plan
   - Healthcare provider notes

Return ONLY valid JSON matching the specified structure.
Include confidence scores (0-1) for each extracted field.`,
};