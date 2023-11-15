import React, { useState } from "react";
import uniqid from "uniqid";
import Modal from "./Modal";
import FormContent from "./FormComponent";
import { AiOutlinePlus } from "react-icons/ai";
import Button from "./Button";
import useEventModel from "@/hooks/useEventAddModel";
import useFormModel from "@/hooks/useFormModel";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface FormModelProps {
  children?: React.ReactNode;
}

interface FormComponent {
  id: string;
  name: string;
  type: string;
  inputType: string;
}

interface OptionComponent {
    component_id: string;
    option_id: string;
    option_value: string;
    Limit_Value: string;
}

const FormModel: React.FC<FormModelProps> = ({ children }) => {
  const [formComponents, setFormComponents] = useState<FormComponent[]>([]);
  const [optionComponents, setOptionComponents] = useState<OptionComponent[]>([])
  const [viewMode, setViewMode] = useState(false);
  const formModel = useFormModel()
  const supabaseClient = useSupabaseClient()
  console.log(formModel.openedId)
  const handleChangeView = () => {
    setViewMode(!viewMode);
  };

  const handleAddComponent = () => {
    const uniqueID = uniqid();
    setFormComponents((prevComponents) => [
      ...prevComponents,
      { id: uniqueID, name: "Enter your Question", type: "text", inputType: "text" }
    ]);
  };

  const handleDeleteComponent = (idToRemove: string) => {
    setFormComponents((prevComponents) =>
      prevComponents.filter((component) => component.id !== idToRemove)
    );
  };

  const handleInputChange = (id: string, newName: string) => {
    setFormComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { ...component, name: newName } : component
      )
    );
  };

  const handleSelectChange = (id: string, type: string) => {
    setFormComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id ? { 
            ...component, 
            type, inputType: getDefaultInputType(type) 
        } : component
      )
    );
  };

  //Option Adding Procedurals
  const handleAddOption = (id:string, optId:string, optVal:string, limit_val:string) => {
    setOptionComponents((optComponent) => [
      ...optComponent,
      {component_id:id, option_id:optId, option_value:optVal, Limit_Value:limit_val}
    ])
    console.log("Added Events Until Now : " + optionComponents)
  }

  //Option Changes Procedurals
  const handleOptionChanges = (id:String, index:string, optVal:string) => {
    const getStartingIndex = optionComponents.findIndex((option) => option.component_id === id)
    if(getStartingIndex !== -1) {
      console.log(`The component_id ${id} is at position ${getStartingIndex}`)
    } else {
      console.log(`Component_id ${id} not found in the array`)
    }
    optionComponents[parseInt(index)+getStartingIndex].option_value = optVal
    console.log(optionComponents[parseInt(index)].option_value)
  }

  const handleLimitChange = (id: string, limit_val:string) => {
    setOptionComponents((prevOptionComponents) =>
      prevOptionComponents.map((option) =>
        option.component_id === id ? { ...option, Limit_Value: limit_val } : option
      )
    );
  };

  const getDefaultInputType = (type: string): string => {
    switch (type) {
      case "text":
        return "text";
      case "options":
        return "options"; // You might want to adjust this based on your use case
      case "date":
        return "date";
      case "attachment":
        return "file";
      default:
        return "text";
    }
  };

  const handleSubmit = async () => {
    console.log("Form Data:", formComponents);
    console.log("Option Content:", optionComponents);
    try {
        const formData = formComponents.map((component) => ({
                formId: formModel.openedId,
                componentId: component.id,
                componentName: component.name,
                componentType: component.type,
                componentInputType: component.inputType,
                componentValue: "",
        }));
        const optionData = optionComponents.map((options) => ({
            optionId: options.option_id,
            formId: formModel.openedId,
            componentId: options.component_id,
            optionValue: options.option_value,
            limitValue: options.Limit_Value,
        }))
        console.log(formData)
        console.log(optionData)

        const {data, error} = await supabaseClient
            .from("FormData")
            .insert(formData);
        if(error) {
            console.error("Error inserting Data: ", error);
        } else {
            console.log("Data inserted Succesfully: ", data)
        }

        if(optionData.length !== 0){
          const {data: OptionData, error: OptionError} = await supabaseClient
              .from("options")
              .insert(optionData);
          if(OptionError) {
              console.error("Error inserting Data: ", OptionError);
          } else {
              console.log("Data inserted Succesfully: ", OptionData)
          }
        }
        setOptionComponents([])
        formModel.onClose()
    } catch (error) {
        console.error("Something went very wrong")
    }
  };
  const onChange = (open: boolean) => {
        if(!open) {
            formModel.onClose();
        }
    }
  return (
    <Modal title="Start Creating Your Form" description="This will be considered as the registration form" onChange={onChange} isOpen={formModel.isOpen}>
      <div className="">
        <button onClick={handleChangeView} className="w-full flex justify-center p-1 rounded-md shadow-sm bg-neutral-700 mb-4">View Form</button>
        <form className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-4">
            {formComponents.map((component) => (
              <div key={component.id}>
                <FormContent
                  id={component.id}
                  name={component.name}
                  type={component.type}
                  inputType={component.inputType}
                  onDelete={() => handleDeleteComponent(component.id)}
                  onInputChange={(name) => handleInputChange(component.id, name)}
                  onSelectChange={(type) => handleSelectChange(component.id, type)}
                  viewMode={viewMode}
                  onOptionAddition={({option_id, option_val, limit_val}) => handleAddOption(component.id, option_id, option_val, limit_val)}
                  onOptionChange={(index, value) => handleOptionChanges(component.id, index, value)}
                  onLimitChange={(limit_value) => handleLimitChange(component.id, limit_value)}
                />
              </div>
            ))}
          </div>
          <div className="flex w-full justify-center">
            <button
              type="button"
              className="p-1 w-fit h-fit border border-neutral-700 rounded-md bg-neutral-700 hover:bg-neutral-600 hover:border-neutral-600 transition"
              onClick={handleAddComponent}
              disabled={viewMode}
            >
              <AiOutlinePlus size={24} />
            </button>
          </div>
          <Button type="button" onClick={handleSubmit} className="mt-4" disabled={viewMode}>
            Submit
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default FormModel;
