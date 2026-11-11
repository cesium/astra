import Modal from "@/components/modal";
import AddFeedbackContent from "./add-feedback-content";

interface IFeedbackModal {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: IFeedbackModal) {
  return (
    <Modal modalState={isOpen} onClose={onClose}>
      <AddFeedbackContent onClose={onClose} />
    </Modal>
  );
}
