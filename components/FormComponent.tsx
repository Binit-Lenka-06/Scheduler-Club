import { useState } from "react"
import Input from "./Input"
import dayjs from "dayjs"
import DatePicker from "react-tailwindcss-datepicker"
import Select from "./Select"
import { MdDelete } from 'react-icons/md';
import { FiCircle } from 'react-icons/fi';
import { AiOutlinePlus } from "react-icons/ai"
import React from "react"
import uniqid from "uniqid"

interface FormContentProps {
    onDelete: () => void;
    viewMode: boolean;
    id: string;
    name: string;
    type: string;
    inputType: string;
    onInputChange: (name: string, options?: { option_id: string; value: string; clicked: boolean }[]) => void;
    onSelectChange: (type: string) => void;
    onOptionAddition: ({option_id, option_val, limit_val}: {option_id: string; option_val: string; limit_val:string}) => void;
    onOptionChange: (index: string, option_val: string) => void //Interface for Changing the data if user changes it
    onLimitChange: (limit_val: string) => void; //This will update the Limit when the user changer it
  }
  

const FormContent: React.FC<FormContentProps> = ({ onDelete, viewMode, id, name, type, inputType, onSelectChange, onInputChange, onOptionAddition, onOptionChange, onLimitChange}) => {
    const [date, setDate] = useState({
        startDate: null,
        endDate: null
    })
    const [selectedValue, setSelectedValue] = useState('text');
    const [options, setOptions] = useState(['Option 1']);
    const [clickedOptions, setClickedOptions] = useState([false])
    const [limitValue, setLimitValue] = useState('1')
    const [uniqueID, setUniqueID] = useState('')
    const [startAdding, setStartAdding] = useState(false)

    const handleAddOption = () => {
        const uniqueID = uniqid()
        setUniqueID(uniqueID)
        const newOption = `Option ${options.length + 1}`;
        setOptions([...options, newOption]);
        setClickedOptions([...clickedOptions, false])
        setLimitValue((parseInt(limitValue) + 1).toString())
        onOptionAddition({option_id:uniqueID, option_val:newOption, limit_val:(parseInt(limitValue)+1).toString()})
    };
    const handleOptionChange = (index, value) => {
        console.log("Changing option at index", index, "to value:", value);
        const newOptions = [...options];
        newOptions[index] = value;
        console.log(newOptions)
        setOptions(newOptions);
        console.log(options)
        onOptionChange(index, value)
    };

    const handleLimitChange = (value) => {
        setLimitValue(value)
        console.log("The current Limit Value is" + limitValue)
        setClickedOptions(Array(clickedOptions.length).fill(false))
        onLimitChange(value)
    }
    const handleDeleteOption = (index) => {
        setOptions((prevOption) => 
        prevOption.filter((_, i) => i !== index)
        )
        setClickedOptions((prevOptions) => 
        prevOptions.filter((_, i) => i !== index)
        )
    }

    const handleClicked = (index) => {
        const newCheckbox = [...clickedOptions]
        const limit_counter = newCheckbox.filter(x => x === true).length;
        if(limit_counter < parseInt(limitValue)){
            newCheckbox[index] = !newCheckbox[index]
            setClickedOptions(newCheckbox)
            console.log(clickedOptions)
        } else if(limit_counter === parseInt(limitValue)){
            newCheckbox[index] = false
            setClickedOptions(newCheckbox)
        }
    }

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        onSelectChange(value)
        console.log('Selected Value:', value);
    };
    const [question, setQuestion] = useState('Enter your Question');

    const handleContentChange = (event) => {
        const value = event.target.innerText;
        setQuestion(value);
        onInputChange(value)
    };
    return(
        <div className={`flex flex-col gap-y-1 rounded-md ${viewMode? "px-0 mb-0" : "bg-neutral-700 px-2 mb-4"}`}>
            <div className="flex flex-row justify-between pt-0 items-center">
                <div contentEditable={!viewMode} className={`text-white pb-1 w-fit ${viewMode ? "px-1": "border-b border-white px-3 pt-2"}`} onBlur={handleContentChange} onFocus={(e) => e.currentTarget.ariaSelected}>
                    {question}
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                    <button onClick={onDelete} className={`${viewMode? "hidden": "visible"}`}>
                        <MdDelete size={20} className="text-white"/>
                    </button>
                    <div className={`${viewMode? "hidden": "visible"}`}>
                        <Select onChange={handleSelectChange} className="h-full rounded-md appearance-none text-center px-2">
                            <option value={"text"}>Text</option>
                            <option value={"options"}>Options</option>
                            <option value={"date"}>Date</option>
                            <option value={"attachement"}>Attachement</option>
                        </Select>
                    </div>
                </div>
            </div>
            {selectedValue === "date" ? (
                <DatePicker
                value={date}
                useRange={false}
                asSingle={true}
                onChange={(values) => {
                    setDate(values)
                }}
                displayFormat="DD/MM/YYYY"
                inputClassName={"bg-[#404040] w-full rounded-md p-3 focus:ring-0 focus:outline-none placeholder:text-white text-white"}
                primaryColor={"red"}
                readOnly={false}
                />
            ):(
                <div>

                </div>
            )}
            {selectedValue === "text" ? (
                <Input type="text" placeholder="Enter your text" className="text-lg"/>
            ): (
                <div>

                </div>
            )}
            {selectedValue === "attachement" ? (
                <Input type="file" placeholder="Enter your text"/>
            ): (
                <div>

                </div>
            )}
            {selectedValue === "options" ? (
                <div className="flex flex-col gap-y-2 bg-neutral-700 px-3 rounded-lg relative">
                    <button className={`text-neutral-400 ${startAdding? "hidden" : "visible"}`} onClick={() => {setStartAdding(true); onOptionAddition({option_id: uniqid(), option_val: "Option 1", limit_val:limitValue})}} type="button">Start Adding</button>
                    {options.map((option, index) => (
                        <React.Fragment key={index}>
                            <div className={`flex flex-row items-center gap-x-3 ${startAdding ? "visible": "hidden"}`}>
                                <button onClick={(e) => handleClicked(index)} type="button">
                                    <FiCircle size={20} fill={`${clickedOptions[index] ? "white" :  "none"}`} className="transition-all"/>
                                </button>
                                <div
                                className="focus:border-b py-4"
                                contentEditable={!viewMode}
                                onBlur={(e) => handleOptionChange(index, e.target.innerText)}
                                >
                                    {option}
                                </div>
                                <button className={`ml-10 ${viewMode ? "hidden": "visible"}`} onClick={(e) => handleDeleteOption(index)} type="button">
                                    <MdDelete size={20} className="text-white"/>
                                </button>
                            </div>
                        </React.Fragment>
                    ))}
                    <button className={`absolute right-10 ${viewMode || !startAdding? "hidden" : "visible"}`} onClick={handleAddOption} type="button">
                        <AiOutlinePlus size={20}/>
                    </button>
                    <div className={`absolute bottom-0 right-2 flex flex-row w-fit gap-x-3 ${viewMode || startAdding === false ? "hidden": "visible"}`}>
                        <div>Limits</div>
                        <div contentEditable={!viewMode} onBlur={(e) => handleLimitChange(e.target.innerText)}>{options.length}</div>
                    </div>
                </div>
            ) : (
                <div></div>
            )}

        </div>
    )
}

export default FormContent