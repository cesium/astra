"use client";

import CalendarView from "@/components/calendar/calendar";
import SettingsWrapper from "@/components/settings-wrapper";
import TabsGroup, {
  PanelContainer,
  Tab,
  TabsContainer,
  TabPanel,
} from "@/components/tabs";
import { useGetStudentScheduleById } from "@/lib/queries/backoffice";
import { extractShifts, formatIShift } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function Student() {
  const params = useParams();

  const { data: studentSchedule } = useGetStudentScheduleById(
    params.student as string,
  );

  console.log("response:", studentSchedule);

  const formattedShifts = formatIShift(extractShifts(studentSchedule || []));
  console.log("Formatted:", formattedShifts);

  return (
    <SettingsWrapper title={"Manage Student | Pombo"}>
      <div className="flex flex-col gap-6">
        <section className="flex items-center justify-center gap-5 md:items-start md:justify-start md:gap-7.5">
          <div className="space-y-1 md:pt-3.5">
            <h2 className="text-dark text-xl font-semibold sm:text-xl lg:text-2xl">
              {"Gonçalo Fernandes"}{" "}
              <span className="text-lg font-normal">a111855</span>
            </h2>
          </div>
        </section>

        <TabsGroup
          defaultPanel="actions"
          layoutId="user-management"
          className="flex h-full w-full flex-col items-center space-y-5"
        >
          <TabsContainer className="self-start">
            <Tab name="Actions" icon="build" refTo="actions" />
            <Tab name="Schedule" icon="calendar_today" refTo="schedule" />
          </TabsContainer>

          <PanelContainer className="min-h-0 w-full flex-1 self-start">
            <TabPanel id="actions">
              <p>actions</p>
            </TabPanel>
            <TabPanel id="schedule" className="flex h-full min-h-0 flex-col">
              <div
                className="w-full"
                style={
                  { "--desktop_height_var": "262px" } as React.CSSProperties
                }
              >
                <CalendarView
                  type="schedule"
                  events={formattedShifts}
                  views={{ work_week: true }}
                  editing={false}
                  className="schedule"
                />
              </div>
            </TabPanel>
          </PanelContainer>
        </TabsGroup>
      </div>
    </SettingsWrapper>
  );
}
