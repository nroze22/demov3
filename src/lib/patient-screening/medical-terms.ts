export const oncologyConditions = [
  'Non-Small Cell Lung Cancer (NSCLC)',
  'Small Cell Lung Cancer (SCLC)',
  'Breast Cancer - HER2+',
  'Breast Cancer - Triple Negative',
  'Breast Cancer - Hormone Receptor+',
  'Colorectal Cancer',
  'Pancreatic Cancer',
  'Multiple Myeloma',
  'Acute Myeloid Leukemia (AML)',
  'Chronic Lymphocytic Leukemia (CLL)',
  'Lymphoma - Hodgkin',
  'Lymphoma - Non-Hodgkin',
  'Melanoma',
  'Ovarian Cancer',
  'Prostate Cancer',
  'Glioblastoma',
  'Renal Cell Carcinoma',
  'Hepatocellular Carcinoma',
  'Bladder Cancer',
  'Esophageal Cancer',
  'Gastric Cancer',
  'Head and Neck Cancer',
  'Thyroid Cancer',
  'Sarcoma',
  'Mesothelioma'
];

export const oncologyBiomarkers = [
  'EGFR Mutation',
  'ALK Rearrangement',
  'ROS1 Fusion',
  'BRAF V600E',
  'PD-L1 Expression',
  'HER2 Amplification',
  'BRCA1/2 Mutation',
  'MSI-H/dMMR',
  'TMB-High',
  'NTRK Fusion',
  'RET Fusion',
  'MET Exon 14 Skipping',
  'KRAS G12C',
  'PIK3CA Mutation',
  'IDH1/2 Mutation'
];

export const oncologyLabValues = [
  'Complete Blood Count (CBC)',
  'White Blood Cell Count (WBC)',
  'Absolute Neutrophil Count (ANC)',
  'Hemoglobin',
  'Platelet Count',
  'Comprehensive Metabolic Panel (CMP)',
  'Alanine Aminotransferase (ALT)',
  'Aspartate Aminotransferase (AST)',
  'Total Bilirubin',
  'Creatinine',
  'Estimated GFR',
  'Albumin',
  'Calcium',
  'Magnesium',
  'Phosphorus',
  'Lactate Dehydrogenase (LDH)',
  'International Normalized Ratio (INR)',
  'Partial Thromboplastin Time (PTT)',
  'Carcinoembryonic Antigen (CEA)',
  'Alpha-Fetoprotein (AFP)',
  'CA-125',
  'PSA',
  'Beta-2 Microglobulin',
  'Serum Protein Electrophoresis',
  'Immunofixation'
];

export const oncologyTreatments = [
  'Chemotherapy',
  'Immunotherapy',
  'Targeted Therapy',
  'Radiation Therapy',
  'Surgery',
  'Stem Cell Transplant',
  'CAR T-Cell Therapy',
  'Hormone Therapy',
  'Checkpoint Inhibitors',
  'PARP Inhibitors',
  'Tyrosine Kinase Inhibitors',
  'Monoclonal Antibodies',
  'Antibody-Drug Conjugates'
];

export const performanceStatus = [
  'ECOG 0',
  'ECOG 1',
  'ECOG 2',
  'ECOG 3',
  'ECOG 4',
  'Karnofsky 100%',
  'Karnofsky 90%',
  'Karnofsky 80%',
  'Karnofsky 70%',
  'Karnofsky 60%',
  'Karnofsky 50%'
];

export const commonComorbidities = [
  'Hypertension',
  'Diabetes Mellitus',
  'Coronary Artery Disease',
  'Chronic Kidney Disease',
  'COPD',
  'Autoimmune Disease',
  'Hepatitis B',
  'Hepatitis C',
  'HIV',
  'Hypothyroidism',
  'Depression',
  'Anxiety'
];

export const operators = [
  { value: 'greater_than', label: '>', description: 'Greater than' },
  { value: 'less_than', label: '<', description: 'Less than' },
  { value: 'equal', label: '=', description: 'Equal to' },
  { value: 'not_equal', label: '≠', description: 'Not equal to' },
  { value: 'greater_equal', label: '≥', description: 'Greater than or equal to' },
  { value: 'less_equal', label: '≤', description: 'Less than or equal to' },
  { value: 'between', label: '↔', description: 'Between (inclusive)' },
  { value: 'includes', label: '∈', description: 'Includes' },
  { value: 'excludes', label: '∉', description: 'Excludes' }
];

export const units = [
  { value: 'years', label: 'Years' },
  { value: 'months', label: 'Months' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'days', label: 'Days' },
  { value: 'mg/dL', label: 'mg/dL' },
  { value: 'g/dL', label: 'g/dL' },
  { value: 'K/uL', label: 'K/uL' },
  { value: 'cells/mm3', label: 'cells/mm³' },
  { value: 'U/L', label: 'U/L' },
  { value: 'ng/mL', label: 'ng/mL' },
  { value: 'mL/min', label: 'mL/min' },
  { value: '%', label: '%' }
];

export const getAllTerms = () => [
  ...oncologyConditions,
  ...oncologyBiomarkers,
  ...oncologyLabValues,
  ...oncologyTreatments,
  ...performanceStatus,
  ...commonComorbidities
];