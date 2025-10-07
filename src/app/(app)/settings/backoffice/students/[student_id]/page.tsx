"use client";

import CalendarView from "@/components/calendar/calendar";
import SettingsWrapper from "@/components/settings-wrapper";
import TabsGroup, {
  PanelContainer,
  Tab,
  TabsContainer,
  TabPanel,
} from "@/components/tabs";
import { useForgotPassword } from "@/lib/mutations/session";
import { useGetStudentById, useGetStudentScheduleById } from "@/lib/queries/backoffice";
import { extractShifts, formatIShift } from "@/lib/utils";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export default function Student() {
  const params = useParams();
  
  const { data: student} = useGetStudentById(params.student_id as string);

  const { data: studentSchedule } = useGetStudentScheduleById(params.student_id as string);

  const formattedShifts = formatIShift(extractShifts(studentSchedule || []));

  const forgotPassword = useForgotPassword();


  return (
    <SettingsWrapper title={"Manage Student | Pombo"}>
      <div className="flex flex-col gap-6">
        <section className="flex items-center justify-center gap-5 md:items-start md:justify-start md:gap-7.5">
          <div className="space-y-1 md:pt-3.5">
            <h2 className="text-dark text-xl font-semibold sm:text-xl lg:text-2xl">
              {`${student?.user.name} - `}
              <span className="text-lg font-normal">{student?.number}</span>
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
            <TabPanel id="actions" className="py-4">
              <button
                onClick={() => {
                  if (student?.user.email) {
                    forgotPassword.mutate({ email: student?.user.email });
                  }
                }}
                disabled={!student?.user.email}
                className={twMerge(clsx(
                  "w-s rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-200 md:text-base",
                  !student?.user.email ? "bg-gray-400 cursor-not-allowed" : "cursor-pointer bg-primary-400 hover:scale-98 hover:bg-primary-400/95")
                )}
              >
                Trigger Forgot Password
              </button>

              {forgotPassword.isSuccess && (
                <p className="mt-4">Forgot Password Email was sent to the user</p>
              )}

              {forgotPassword.isError && (
                <p className="mt-4">Something went wrong</p>
              )}

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
