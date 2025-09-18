export default function Home() {
  return (
    <div className=" m-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Third Party API Examples
      </h1>
      <ul className="space-y-2 text-gray-700 text-lg flex-col justify-center item-center">
        <li className="flex items-center gap-3">1.Google Maps API</li>
        <li className="flex items-center gap-3">
          2.Razorpay Payment Integration
        </li>
        <li className="flex items-center gap-3">3.Firebase Usage</li>
        <li className="flex items-center gap-3">
          4.CI/CD Pipeline Implementation
        </li>
      </ul>
    </div>
  );
}
