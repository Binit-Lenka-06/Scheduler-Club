import useFormModelForMember from "@/hooks/useFormModalForMember"
import Modal from "./Modal"
import Button from "./Button"
import { useState } from "react"
import FormModelMemberContent from "./FormModelMemberContent"

const FormModelForMember= () => {
    const formmodelformembers = useFormModelForMember()
    const onChange = (open: boolean) => {
        if(!open){
            formmodelformembers.onClose();
            setBringItOn(false)
        }
    }
    const Form_ID = formmodelformembers.eventId
    const [BringItOn, setBringItOn] = useState(false)

    const handleOnClick = () => {
        setBringItOn(true)
    }
    return(
        <Modal
        title={`${BringItOn ? "Submit Registration Form": "Submit Registration Form"}`}
        description={`${BringItOn ? "Enter the details carefully it can't be undone": ""}`}
        isOpen={formmodelformembers.isOpen}
        onChange={onChange} 
        >
            <div className="flex flex-col gap-y-4">
                {BringItOn && (
                    <FormModelMemberContent />
                )}
                <Button type="button" onClick={handleOnClick} className={`${BringItOn ? "hidden": "visible"}`}>
                    Procede For Registration
                </Button>
            </div>
        </Modal>
    )
}

export default FormModelForMember