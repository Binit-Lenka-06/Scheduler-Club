import FormModelForMember from "@/components/FormModelForMember";
import useFormModelForMember from "@/hooks/useFormModalForMember";
import { Forms } from "@/types"

interface FormContentForGetProps {
    forms: Forms[];
    eventId: string;
}

const FormContentForGet: React.FC<FormContentForGetProps> = ({forms, eventId}) => {
    console.log(forms)
    const filteredForms = forms.filter((item) => item.formId === eventId);
    const FormModelForMembers = useFormModelForMember()
    FormModelForMembers.onOpen()
    return(
        <div>
            {filteredForms.map((items) => (
                <FormModelForMember/>
            ))}
        </div>
    )
}

export default FormContentForGet