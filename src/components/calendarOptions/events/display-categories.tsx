import CustomDisclosure from "@/components/disclosure";
import { IEventCategoriesSorted } from "@/lib/types";
import EventHeader from "../common/item-card";
import ScrollableContainer from "../common/scrollable-container";

export default function DisplayCategories({
  items,
  isEditing = false,
  state,
  onAction,
}: {
  items: IEventCategoriesSorted;
  isEditing?: boolean;
  state?: "add" | "remove";
  onAction?: (id: string) => void;
}) {
  const ordinalNumbers = ["1st", "2nd", "3rd", "4th", "5th"];

  if (!(items.length > 0)) {
    return (
      <div className="text-dark/50 flex h-full justify-center pt-40">
        There are no events to be displayed
      </div>
    );
  } else if (state === "add") {
    return (
      <div className="no-scrollbar h-full overflow-y-scroll pb-14">
        {items.map((yearGroup) =>
          yearGroup.year ? (
            <CustomDisclosure
              label={`${ordinalNumbers[yearGroup.year - 1]} Year`}
              key={`${ordinalNumbers[yearGroup.year - 1]} Year`}
            >
              <div className="mt-1 ml-2 h-full w-full">
                {Object.entries(yearGroup.semesters).map(
                  ([semesterKey, categories]) => (
                    <CustomDisclosure
                      label={`${ordinalNumbers[Number(semesterKey) - 1]} Semester`}
                      key={`${ordinalNumbers[Number(semesterKey) - 1]} Semester`}
                    >
                      <div className="divide-dark/8 bg-light w-full space-y-3 divide-y rounded-lg pt-3 pl-4">
                        {categories.map((category) => (
                          <EventHeader
                            key={category.id}
                            name={category.name}
                            eventId={category.id}
                            color={category.color}
                            isEditing={isEditing}
                            state={state}
                            onAction={
                              category.type === "optional"
                                ? onAction
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    </CustomDisclosure>
                  ),
                )}
              </div>
            </CustomDisclosure>
          ) : (
            !yearGroup.year && (
              <CustomDisclosure label="Other" key="Other">
                <div className="divide-dark/8 bg-light w-full space-y-3 divide-y rounded-lg pt-3 pl-4">
                  {Object.values(yearGroup.semesters).flatMap((categories) =>
                    categories.map((category) => (
                      <EventHeader
                        key={category.id}
                        name={category.name}
                        eventId={category.id}
                        color={category.color}
                        isEditing={isEditing}
                        state={state}
                        onAction={
                          category.type === "optional" ? onAction : undefined
                        }
                      />
                    )),
                  )}
                </div>
              </CustomDisclosure>
            )
          ),
        )}
      </div>
    );
  } else {
    return (
      <ScrollableContainer items={items}>
        {items.flatMap((yearGroup) =>
          Object.values(yearGroup.semesters).flatMap((categories) =>
            categories.map((category) => (
              <EventHeader
                key={category.id}
                name={category.name}
                eventId={category.id}
                color={category.color}
                isEditing={isEditing}
                state={state}
                onAction={category.type === "optional" ? onAction : undefined}
              />
            )),
          ),
        )}
      </ScrollableContainer>
    );
  }
}
