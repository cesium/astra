"use client";

import { AuthCheck } from "@/components/auth-check";
import CustomCombobox from "@/components/combobox";
import CustomPieChart from "@/components/custom-pie-chart";
import SettingsWrapper from "@/components/settings-wrapper";
import { useGetStatistics } from "@/lib/queries/backoffice";
import { useGetAllCourses } from "@/lib/queries/courses";
import { ICourse } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const getShortShiftType = (shiftType: string) => {
  switch (shiftType) {
    case "theoretical":
      return "T";
    case "theoretical_practical":
      return "TP";
    case "practical_laboratory":
      return "PL";
    case "tutorial_guidance":
      return "TG";
    default:
      return shiftType;
  }
};

interface IShift {
  type: string;
  capacity: number;
  occupation: number;
  number: number;
}

function formatCourses(courses: ICourse[] | undefined) {
  if (!courses) return [];

  return courses.map((course) => {
    return { id: course.id, name: course.name };
  });
}

export default function Statistics() {
  const [selectedCourse, setSelectedCourse] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: allCourses } = useGetAllCourses();
  const formattedCourses = formatCourses(allCourses);

  const { data: statistics, refetch } = useGetStatistics(
    selectedCourse?.id || "",
  );

  const shifts = useMemo(
    () => (statistics ? statistics.shifts : []),
    [statistics],
  );

  useEffect(() => {
    if (selectedCourse?.id) {
      refetch();
    }
  }, [selectedCourse?.id, refetch]);

  const tShifts: IShift[] = shifts.filter(
    (shift: IShift) => shift.type === "theoretical",
  );
  const tpShifts: IShift[] = shifts.filter(
    (shift: IShift) => shift.type === "theoretical_practical",
  );
  const plShifts: IShift[] = shifts.filter(
    (shift: IShift) => shift.type === "practical_laboratory",
  );
  const tgShifts: IShift[] = shifts.filter(
    (shift: IShift) => shift.type === "tutorial_guidance",
  );

  const orderedShifts = useMemo(() => {
    return [...shifts].sort((a: IShift, b: IShift) => {
      const priority = (type: string) => {
        const short = getShortShiftType(type);
        return short === "T" ? 0 : short === "TP" ? 2 : 1;
      };

      return priority(a.type) - priority(b.type) || a.number - b.number;
    });
  }, [shifts]);

  return (
    <AuthCheck userTypes={["admin", "professor"]}>
      <SettingsWrapper title="Statistics">
        <div className="flex h-full flex-col gap-8 pb-8">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Statistics</h2>
            <p>View and analyze course statistics</p>
          </section>

          <section className="space-y-10">
            <div className="max-w-2xl space-y-6">
              <div className="space-y-1">
                <p className="pl-2 font-semibold select-none">Courses</p>
                <CustomCombobox
                  items={formattedCourses}
                  selectedItem={selectedCourse}
                  setSelectedItem={setSelectedCourse}
                  placeholder="Select a course"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <h3 className="text-lg font-semibold">Shift Statistics</h3>
              <div className="flex flex-wrap justify-evenly gap-8 lg:justify-start">
                {orderedShifts.map(
                  (
                    shift: {
                      type: string;
                      capacity: number;
                      occupation: number;
                      number: number;
                    },
                    index: number,
                  ) => (
                    <div key={index}>
                      <CustomPieChart
                        data={[
                          {
                            name: "Occupied",
                            value: shift.occupation,
                            type: getShortShiftType(shift.type),
                            number: shift.number,
                            capacity: shift.capacity,
                          },
                          {
                            name: "Available",
                            value: shift.capacity - shift.occupation,
                            type: getShortShiftType(shift.type),
                            number: shift.capacity - shift.occupation,
                            capacity: shift.capacity,
                          },
                        ]}
                        colors={["#ee7749", "#f4a67d"]}
                        label={`${getShortShiftType(shift.type)}${shift.number}`}
                      />
                    </div>
                  ),
                )}
                {orderedShifts.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No statistics available for the selected course.
                  </p>
                )}
              </div>
            </div>
            <div className="mb-16 flex w-full flex-col gap-4">
              <h3 className="text-lg font-semibold">
                Overall Shifts Statistics
              </h3>
              <div className="flex flex-wrap justify-center gap-8 sm:justify-start">
                <CustomPieChart
                  data={tShifts.map((shift) => ({
                    name: `${getShortShiftType(shift.type)}${shift.number}`,
                    value: shift.occupation,
                    number: shift.number,
                    capacity: shift.capacity,
                  }))}
                  colors={["#ee7749", "#f4a67d"]}
                  label="T"
                  mode="shifts_comparison"
                />
                <CustomPieChart
                  data={tpShifts.map((shift) => ({
                    name: `${getShortShiftType(shift.type)}${shift.number}`,
                    value: shift.occupation,
                    number: shift.number,
                    capacity: shift.capacity,
                  }))}
                  colors={["#ee7749", "#f4a67d"]}
                  label="TP"
                  mode="shifts_comparison"
                />
                <CustomPieChart
                  data={plShifts.map((shift) => ({
                    name: `${getShortShiftType(shift.type)}${shift.number}`,
                    value: shift.occupation,
                    number: shift.number,
                    capacity: shift.capacity,
                  }))}
                  colors={["#ee7749", "#f4a67d"]}
                  label="PL"
                  mode="shifts_comparison"
                />
                <CustomPieChart
                  data={tgShifts.map((shift) => ({
                    name: `${getShortShiftType(shift.type)}${shift.number}`,
                    value: shift.occupation,
                    number: shift.number,
                    capacity: shift.capacity,
                  }))}
                  colors={["#ee7749", "#f4a67d"]}
                  label="TG"
                  mode="shifts_comparison"
                />
                {shifts.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No statistics available for the selected course.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </SettingsWrapper>
    </AuthCheck>
  );
}
