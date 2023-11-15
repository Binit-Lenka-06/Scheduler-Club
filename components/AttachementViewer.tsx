import useAttachementModel from "@/hooks/useAttachementViewerModel"
import Modal from "./Modal"
import useLoadFileData from "@/hooks/useLoadFileData";

interface AttachementVewerDatas {
    data: string;
}
const AttachementViewer: React.FC<AttachementVewerDatas> = ({
    data
}) => {
    const attachementModel = useAttachementModel();
    const onChange = (open: boolean) => {
        if(!open){
            attachementModel.onClose();
        }
    }
    console.log(useLoadFileData(data))
    return(
        <Modal
        title="Attachements"
        description="These attachements are uploaded as an add on to the details"
        isOpen={attachementModel.isOpen}
        onChange={onChange}
        >
            Attached Files
        </Modal>
    )
}

export default AttachementViewer