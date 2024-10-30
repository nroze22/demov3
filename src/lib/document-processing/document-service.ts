import nlp from 'compromise';
import natural from 'natural';

export async function processDocument(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function extractEntities(text: string) {
  const doc = nlp(text);
  
  // Extract dates
  const dates = doc.dates().json();
  
  // Extract numbers and measurements
  const numbers = doc.numbers().json();
  
  // Extract medical terms using natural
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  
  // Use compromise for named entity recognition
  const people = doc.people().json();
  const places = doc.places().json();
  const organizations = doc.organizations().json();

  return {
    dates,
    numbers,
    tokens,
    people,
    places,
    organizations
  };
}

export function preprocessText(text: string): string {
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  // Normalize dates
  text = text.replace(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/g, '$1/$2/$3');
  
  // Normalize phone numbers
  text = text.replace(/(\d{3})[.-]?(\d{3})[.-]?(\d{4})/g, '($1) $2-$3');
  
  // Expand common medical abbreviations
  const abbreviations: { [key: string]: string } = {
    'pt': 'patient',
    'dx': 'diagnosis',
    'hx': 'history',
    'rx': 'prescription',
    'tx': 'treatment'
  };
  
  Object.entries(abbreviations).forEach(([abbr, full]) => {
    text = text.replace(new RegExp(`\\b${abbr}\\b`, 'gi'), full);
  });

  return text;
}