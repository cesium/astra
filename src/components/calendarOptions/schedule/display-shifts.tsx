import CustomDisclosure from '@/components/disclosure';
import { IShiftsSorted } from '@/lib/types';
import EventHeader from '../common/item-card';
import ScrollableContainer from '../common/scrollable-container';

export default function DisplayShifts({
  shiftsSorted,
  isEditing = false,
  state,
  onAdd,
  onRemove,
}: {
  shiftsSorted: IShiftsSorted;
  isEditing?: boolean;
  state?: "add" | "remove";
  onAdd: (id:string) => void,
  onRemove: (id:string) => void,
}) {

  const ordinalNumbers = ["1st", "2nd", "3rd", "4th", "5th"];

  if (!(shiftsSorted.length > 0)) {
    return (
      <div className="text-dark/50 flex h-full justify-center pt-40">
        There are no shifts to be displayed
      </div>
    );
  } else if (state === "add") {
    return (
      <div className="no-scrollbar h-full overflow-y-scroll">
        {shiftsSorted.map((yearGroup) => (
          <CustomDisclosure
            disclosureChild
            label={`${ordinalNumbers[yearGroup.year - 1]} Year`}
            key={`${ordinalNumbers[yearGroup.year - 1]} Year`}
          >
            <div className="mt-1 ml-2 h-full w-full">
              {Object.entries(yearGroup.semesters).map(
                ([semester, courses]) => (
                  <CustomDisclosure
                    label={`${ordinalNumbers[Number(semester) - 1]} Semester`}
                    key={`${ordinalNumbers[Number(semester) - 1]} Semester`}
                  >
                    <div
                      className="divide-dark/8 bg-light w-full space-y-2 divide-y rounded-lg pt-3 pl-4"
                    >
                      {Object.entries(courses).map(([courseID, courseData]) => (
                        <EventHeader
                          key={courseID}
                          name={courseData.courseName}
                          color={courseData.color}
                          shifts={courseData.shifts}
                          isEditing={isEditing}
                          state={state}
                          onAdd={onAdd}
                          onRemove={onRemove}
                        />
                      ))}
                    </div>
                  </CustomDisclosure>
                ),
              )}
            </div>
          </CustomDisclosure>
        ))}
      </div>
    );
  } else {
    return (
      <ScrollableContainer items={shiftsSorted}>

        {shiftsSorted.map((yearGroup) =>
            Object.entries(yearGroup.semesters).map(([, courses]) =>
              Object.entries(courses).map(([courseID, courseData]) => (
                <EventHeader
                  key={courseID}
                  name={courseData.courseName}
                  color={courseData.color}
                  shifts={courseData.shifts}
                  isEditing={isEditing}
                  state={state}
                  onAdd={onAdd}
                  onRemove={onRemove}
                />
              )),
            ),
          )}
          
      </ScrollableContainer>
    );
  }
}