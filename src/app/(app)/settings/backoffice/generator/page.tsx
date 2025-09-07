"use client";

import CustomSelect from "@/components/select";
import SettingsWrapper from "@/components/settings-wrapper";
import { useState } from "react";

const randomItems: { id: string; name: string }[] = [];

export default function GenerateSchedule() {
  const [selectedCourse, setselectedCourse] = useState(randomItems[0]);
  const [selectedSemester, setSelectedSemester] = useState({
    id: "semester-1",
    name: "1",
  });

  return (
    <SettingsWrapper title="Schedule Generator">
      <div className="flex h-full flex-col gap-8">
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Generate new schedule</h2>
          <p>Trigger the schedule generator with a few clicks</p>
        </section>

        <section className="space-y-6">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-1">
              <p className="pl-2 font-semibold">Course</p>
              <CustomSelect
                items={randomItems}
                selectedItem={selectedCourse}
                setSelectedItem={setselectedCourse}
              />
            </div>

            <div className="space-y-1">
              <p className="pl-2 font-semibold">Semester</p>
              <CustomSelect
                items={[1, 2].map((semester) => ({
                  id: `semester-${semester}`,
                  name: semester.toString(),
                }))}
                selectedItem={selectedSemester}
                setSelectedItem={setSelectedSemester}
              />
            </div>
          </div>

          <button className="bg-primary-400 hover:bg-primary-400/95 mt-6 min-w-1/4 cursor-pointer rounded-lg px-4 py-2 font-semibold text-white transition-all duration-200 hover:scale-98">
            Generate Schedule
          </button>
        </section>
      </div>
    </SettingsWrapper>
  );
}
