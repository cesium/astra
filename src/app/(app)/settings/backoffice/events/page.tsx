import { AuthCheck } from "@/components/auth-check";
import SettingsWrapper from "@/components/settings-wrapper";

export default function EventsManagement() {
  return (
    <>
      <title>Jobs | Pombo</title>
      <AuthCheck userTypes={["admin", "professor"]}>
        <SettingsWrapper title="Events & Categories">
          <div className="flex h-full flex-col gap-8">
            <section className="h-1/2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Event Categories</h2>
                  <p>Manage categories for your calendar events</p>
                </div>

                <button className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-1.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95">
                  <span className="material-symbols-outlined text-xl">add</span>
                  <p className="text-sm font-semibold">New Category</p>
                </button>
              </div>
            </section>

            <section className="h-1/2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Calendar Events</h2>
                  <p>Create and manage events for your calendar</p>
                </div>

                <button className="bg-primary-400 hover:bg-primary-400/95 inline-flex h-fit cursor-pointer items-center justify-center space-x-0.5 rounded-lg px-3 py-2 text-white transition-all duration-200 hover:scale-95">
                  <span
                    className="material-symbols-outlined-filled"
                    style={{ fontSize: "20px" }}
                  >
                    add
                  </span>
                  <p className="text-sm font-semibold">New Event</p>
                </button>
              </div>
            </section>
          </div>
        </SettingsWrapper>
      </AuthCheck>
    </>
  );
}
