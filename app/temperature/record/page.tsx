"use client";

import React from "react";
import TemperatureForm from "../../../components/temperature/TemperatureForm";

export default function RecordTemperaturePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Record Temperature</h1>
      <TemperatureForm />
    </div>
  );
}
