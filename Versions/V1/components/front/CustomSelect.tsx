import { useState, useEffect, useRef } from "react";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    selectedValue: string;
    setSelectedValue: (value: string) => void;
    options: Option[];
    placeholder: string;
    className?: string;
}

const CustomSelect = ({ selectedValue, setSelectedValue, options, placeholder, className }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement | null>(null);

    // Toggle visibility of options
    const toggleDropdown = () => setIsOpen(!isOpen);

    // Close dropdown when clicking outside
    useEffect(() => {
        const closeDropdown = (e: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        window.addEventListener("click", closeDropdown);

        return () => {
            window.removeEventListener("click", closeDropdown);
        };
    }, []);

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        setIsOpen(false); // Close the dropdown after selecting
    };

    return (
        <div ref={selectRef} className={`relative ${className}`}>
            {/* Sélection */}
            <div
                className="bg-transparent text-white border border-white rounded p-2 cursor-pointer select-none"
                onClick={toggleDropdown}
            >
                <span>
                  {selectedValue ? options.find(option => option.value === selectedValue)?.label : placeholder}
                </span>
            </div>

            {/* Liste déroulante */}
            {isOpen && (
                <div
                    className="absolute left-0 right-0 top-full mt-1 bg-gray-900 border border-gray-500 rounded shadow-lg z-50 animate-fadeIn"
                >
                    {options.map(option => (
                        <div
                            key={option.value}
                            className="p-2 cursor-pointer hover:bg-gray-700 text-white select-none transition-colors duration-200"
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}

            {/* Sélecteur natif caché pour l'accessibilité */}
            <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                className="hidden"
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CustomSelect;
