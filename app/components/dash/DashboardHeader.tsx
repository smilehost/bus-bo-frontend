import { getTextDashboard, useLanguageContext } from "@/app/i18n/translations";

export default function DashboardHeader() {
  const isTH = useLanguageContext();
  const text = getTextDashboard(isTH);
    return (
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{text.title}</h1>
        <p className="text-gray-600">
          {text.subtitle}
        </p>
      </div>
    );
  }
  