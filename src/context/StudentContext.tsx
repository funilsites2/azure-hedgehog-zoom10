"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type StudentInfo = {
  name: string;
  imageUrl: string;
};

type StudentContextType = {
  logoUrl: string | null;
  student: StudentInfo;
  setLogo: (url: string) => void;
  setStudent: (info: StudentInfo) => void;
};

const STORAGE_LOGO = "admin_menu_logo_url";
const STORAGE_STUDENT = "admin_menu_student_info";

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_LOGO);
    return stored ? JSON.parse(stored) : null;
  });
  const [student, setStudentState] = useState<StudentInfo>(() => {
    const stored = localStorage.getItem(STORAGE_STUDENT);
    return stored
      ? JSON.parse(stored)
      : { name: "", imageUrl: "" };
  });

  useEffect(() => {
    if (logoUrl !== null) {
      localStorage.setItem(STORAGE_LOGO, JSON.stringify(logoUrl));
    } else {
      localStorage.removeItem(STORAGE_LOGO);
    }
  }, [logoUrl]);

  useEffect(() => {
    if (student.name || student.imageUrl) {
      localStorage.setItem(STORAGE_STUDENT, JSON.stringify(student));
    } else {
      localStorage.removeItem(STORAGE_STUDENT);
    }
  }, [student]);

  const setLogo = (url: string) => setLogoUrl(url);
  const setStudent = (info: StudentInfo) => setStudentState(info);

  return (
    <StudentContext.Provider
      value={{ logoUrl, student, setLogo, setStudent }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used within StudentProvider");
  return ctx;
};