import { Metadata } from "next";
import ScheduleCalendar from "@/components/schedule-calendar";
import TabsGroup, {
  TabsContainer,
  Tab,
  PanelContainer,
  TabPanel,
} from "@/components/tabs";

export const metadata: Metadata = {
  title: "Pombo | Schedule",
};

export default function Schedule() {
  return (
    <div className="flex gap-8">
      <section className="hidden w-sm bg-gray-100 md:block">
        <TabsGroup defaultPanel="tab1">
          <TabsContainer>
            <Tab name="Tab1" icon="search" refTo="tab1" />
            <Tab name="Tab2" icon="home" refTo="tab2" />
            <Tab name="Tab3" icon="favorite" refTo="tab3" />
          </TabsContainer>

          <PanelContainer>
            <TabPanel id="tab1">
              <h1>Hello, tab1</h1>
            </TabPanel>
            <TabPanel id="tab2">
              <h1>Hello, tab2</h1>
            </TabPanel>
            <TabPanel id="tab3">
              <h1>Hello, tab3</h1>
            </TabPanel>
          </PanelContainer>
        </TabsGroup>
      </section>
      <ScheduleCalendar />
    </div>
  );
}
