import CustomDisclosure from "@/components/disclosure";
import { IEvent } from "@/lib/types";
import EventHeader from "../common/item-card";
import ScrollableContainer from "../common/scrollable-container";

export default function DisplayEvents({
  itemsSorted,
  isEditing = false,
  state,
  onAction,
}: {
  itemsSorted: IEvent[];
  isEditing?: boolean;
  state?: "add" | "remove";
  onAction?: (id: string) => void;
}) {
  const ordinalNumbers = ["1st", "2nd", "3rd", "4th", "5th"];

  if (!(itemsSorted.length > 0)) {
    return (
      <div className="text-dark/50 flex h-full justify-center pt-40">
        There are no events to be displayed
      </div>
    );
  } else if (state === "add") {
    return (
      <div className="no-scrollbar h-full overflow-y-scroll">
        {/*content here*/}
      </div>
    );
  } else {
    return (
      <ScrollableContainer items={itemsSorted}>
        {/*content here*/}
        <></>
      </ScrollableContainer>
    );
  }
}
