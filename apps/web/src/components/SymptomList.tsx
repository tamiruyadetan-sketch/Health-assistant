interface SymptomListProps {
  symptoms: string[];
}

export default function SymptomList({ symptoms }: SymptomListProps) {
  return (
    <ul className="list-inside list-disc space-y-1.5">
      {symptoms.map((symptom) => (
        <li key={symptom}>{symptom}</li>
      ))}
    </ul>
  );
}