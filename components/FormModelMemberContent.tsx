import useFormModelForMember from "@/hooks/useFormModalForMember";
import { useState } from "react";
import DatePicker from "react-tailwindcss-datepicker";
import Input from "./Input";
import Button from "./Button";
import FormComponent from "./FormComponent";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import uniqid from "uniqid";
import { FiCircle } from "react-icons/fi";

interface FieldValue {
    [key: string]: string | File | null| any;
}

const FormModelMemberContent = () => {
    const formodalforload = useFormModelForMember();
    const [date, setDate] = useState({
        startDate: null,
        endDate: null,
    });
    const filteredItems = formodalforload.eventData
        ? formodalforload.eventData.filter((item) => item.formId === formodalforload.eventId)
        : [];

    const initialFieldValues: FieldValue[] = (formodalforload.eventData || []).reduce((acc: FieldValue[], component) => {
        if (component.componentType === "date") {
            acc.push({ [component.componentId]: null });
        } else {
            acc.push({ [component.componentId]: "" });
        }
        return acc;
        }, []);
          
      

    const optionItemsCaptured = formodalforload.componentOptions
    const [fieldValues, setFieldValues] = useState<FieldValue[]>(initialFieldValues);
    const [clickedOptions, setClickedOptions] = useState(Array(optionItemsCaptured?.length).fill(false));
    const [selectedOptions, setSelectedOptions] = useState<Array<{ componentId: string, optionValue: string }>>([]);


    //Handling ChekBox Change
    const handleClicked = (index: any, id:string, optVal:string) => {
        const newClickedOptions = [...clickedOptions];
        const limit_length = optionItemsCaptured?.filter(final => final.componentId === id)?.[(optionItemsCaptured.filter(obj => obj.componentId === id).length - 1)]?.limitValue;
        const limit_counter = newClickedOptions.filter(x => x === true).length;
    
        if(limit_length !== undefined && limit_counter < parseInt(limit_length)) {
            newClickedOptions[index] = !newClickedOptions[index];
            setClickedOptions(newClickedOptions);
    
            if(newClickedOptions[index]){
                // Add the selected option to the state
                setSelectedOptions(prevOptions => [
                    ...prevOptions,
                    { componentId: id, optionValue: optVal }
                ]);
            } else {
                // Remove the deselected option from the state
                setSelectedOptions(prevOptions => 
                    prevOptions.filter(option => !(option.componentId === id && option.optionValue === optVal))
                );
            }
        } else if(limit_length !== undefined && limit_counter === parseInt(limit_length)) {
            newClickedOptions[index] = false;
            setClickedOptions(newClickedOptions);
    
            // Remove the deselected option from the state
            setSelectedOptions(prevOptions => 
                prevOptions.filter(option => !(option.componentId === id && option.optionValue === optVal))
            );
        }
    
        console.log(selectedOptions);
    };
    
    

    const handleInputChange = (componentId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValues((prevValues) =>
            prevValues.map((field) =>
                field.hasOwnProperty(componentId) ? { [componentId]: e.target.value } : field
            )
        );
    };

    const handleFileChange = (componentId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setFieldValues((prevValues) =>
            prevValues.map((field) =>
              field.hasOwnProperty(componentId) ? { [componentId]: e.target.files?.[0] } : field
            )
          );
        }
      };
      

    const handleDateChange = (componentId: string) => (values: any) => {
        setDate(values);
        setFieldValues((prevValues) =>
            prevValues.map((field) =>
                field.hasOwnProperty(componentId) ? { [componentId]: values.startDate } : field
            )
        );
    };
    const { user } = useUser()
    const supabaseClient = useSupabaseClient()
    
    const handleSubmit = async (e: React.FormEvent) => {
        const selectedOptionsObject: Record<string, string[]> = {};
        const flatDataArray = fieldValues.flatMap((field, index) =>
            Object.entries(field).map(([componentId, value]) => ({
                componentId,
                value,
            }))
        );

        selectedOptions.forEach((option) => {
            const componentId = option.componentId;
    
            if (!selectedOptionsObject[componentId]) {
                selectedOptionsObject[componentId] = [];
            }
    
            selectedOptionsObject[componentId].push(option.optionValue);
        });

        
        console.log("These are the options you selected" + selectedOptions)
        console.log(flatDataArray)
    
        const attachmentPromises = flatDataArray
            .filter(({ value }) => value instanceof File)
            .map(async ({ componentId, value }) => {
                const file = value as File;
                const uniqueID = uniqid();
                const { data, error } = await supabaseClient
                    .storage
                    .from('attachements')
                    .upload(`attaches-${componentId}-${uniqueID}`, file, {
                        cacheControl: '3600',
                        upsert: false,
                    });
    
                if (error) {
                    throw new Error(`Error uploading file for ${componentId}: ${error.message}`);
                }
    
                return {
                    componentId,
                    filePath: data.path,
                };
            });
    
        try {
            e.preventDefault();
    
            const attachmentResults = await Promise.all(attachmentPromises);
    
            // Create a new array with updated componentId
            const updatedDataArray = flatDataArray.map((item) => {
                const attachmentResult = attachmentResults.find((result) => result.componentId === item.componentId);
    
                return {
                    ...item,
                    value: attachmentResult ? attachmentResult.filePath : item.value,
                };
            });

            const updatedFlatDataArray = updatedDataArray.map((item) => {
                const componentId = item.componentId;

                if (selectedOptionsObject[componentId]) {
                    return {
                        ...item,
                        value: selectedOptionsObject[componentId].join(', ')
                    }
                } else {
                    return item
                }
            })


            console.log(flatDataArray)
            console.log(updatedFlatDataArray)
    
            // Insert registration data
            const { data, error } = await supabaseClient
                .from('registrations')
                .insert(
                    updatedFlatDataArray.map(({ componentId, value }) => ({
                        user_id: user?.id,
                        event_id: formodalforload.eventId,
                        component_id: componentId,
                        component_value: value,
                    }))
                );
    
            if (error) {
                console.log(Error);
            } else {
                console.log("Data Inserted Successfully");
                const { data: selectUserData, error: selectUserError } = await supabaseClient
                    .from('users')
                    .select('registered_events_number')
                    .eq('id', user?.id);
                console.log(selectUserData)
                let registered_events_array = selectUserData?.[0].registered_events_number
                registered_events_array = registered_events_array + 1
                const { data: updateUserData, error: updateUserError } = await supabaseClient
                    .from('users')
                    .update({
                        registered_events_number: registered_events_array,
                    })
                    .eq('id', user?.id);

                if (updateUserError) {
                    console.log("Error updating user data:", updateUserError);
                } else {
                    console.log("User Data Updated Successfully");
                }

                formodalforload.onClose();
                }
        } catch (error) {
            console.log("Error inserting data : ", error);
        }
    };
    
    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {filteredItems && filteredItems.length > 0 ? (
                    <div className="flex flex-col gap-y-4">
                        {filteredItems.map((component) => (
                            <div key={component.componentId} className="flex flex-col gap-y-1 rounded-md">
                                <div>{component.componentName}</div>
                                {component.componentType === "date" ? (
                                    <DatePicker
                                        value={date}
                                        useRange={false}
                                        asSingle={true}
                                        onChange={handleDateChange(component.componentId)}
                                        popoverDirection="down"
                                        displayFormat="DD/MM/YYYY"
                                        inputClassName={"bg-[#404040] w-full rounded-md p-3 focus:ring-0 focus:outline-none placeholder:text-white text-white"}
                                        primaryColor={"red"}
                                        readOnly={false}
                                    />
                                ) : (
                                    <div></div>
                                )}
                                {component.componentType === "text" ? (
                                    <Input
                                        type="text"
                                        placeholder={`Enter ${component.componentName}`}
                                        className="text-lg"
                                        onChange={handleInputChange(component.componentId)}
                                    />
                                ) : (
                                    <div></div>
                                )}
                                {component.componentType === "attachement" ? (
                                    <Input
                                        type="file"
                                        placeholder={`Attach ${component.componentName}`}
                                        onChange={handleFileChange(component.componentId)}
                                    />
                                ) : (
                                    <div></div>
                                )}
                                {component.componentType === "options" ? (
                                    <div className="flex flex-col gap-y-2 bg-neutral-700 px-3 rounded-lg relative">
                                        {optionItemsCaptured?.filter((items) => items.componentId === component.componentId).map((items, index) => (
                                            <div key={items.optionId} className="flex flex-row items-center gap-x-3">
                                                <button type="button" onClick={() => handleClicked(index, component.componentId, items.optionValue)}>
                                                    <FiCircle size={20} className={`transition-all ${clickedOptions[index] ? 'text-green-500' : 'text-gray-500'}`} />
                                                </button>
                                                <div className="py-4">
                                                    {items.optionValue}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="absolute right-1 bottom-1 flex flex-row items-center gap-x-2 bg-neutral-800 rounded-md px-2 opacity-50 cursor-default select-none">
                                            Selection Limit <p className="w-fit p-1">{optionItemsCaptured?.filter(final => final.componentId === component.componentId)?.[(optionItemsCaptured.filter(obj => obj.componentId === component.componentId).length - 1)].limitValue}</p>
                                        </div>
                                    </div>
                                ):(
                                    <div></div>
                                )}
                            </div>
                        ))}
                        <Button type="submit">Register</Button>
                    </div>
                ) : (
                    <div className="w-full h-fit flex justify-center">Form not created yet.</div>
                )}
            </form>
        </div>
    );
};

export default FormModelMemberContent;
