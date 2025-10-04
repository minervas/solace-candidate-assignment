"use client";

import { DataTable } from "@/components/DataTable";
import { SearchBar } from "@/components/SearchBar";
import { StringList } from "@/components/StringList";
import { Title } from "@/components/Title";
import { Advocate } from "@/db/schema";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useEffect, useState } from "react";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const handleSearch = (searchTerm: string) => {
    console.log("filtering advocates...");
    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.find(value => value.includes(searchTerm)) ||
        advocate.phoneNumber.toString().includes(searchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm)
      );
    });
    setFilteredAdvocates(filtered);
  };

  const handleReset = () => {
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <Title>Solace Advocates</Title>
      <SearchBar onSearch={handleSearch} onReset={handleReset} />
      <DataTable<Advocate>
        data={filteredAdvocates}
        columns={[
          { header: "First Name", cell: (row) => row.firstName },
          { header: "Last Name", cell: (row) => row.lastName },
          { header: "City", cell: (row) => row.city },
          { header: "Degree", cell: (row) => row.degree },
          {
            header: "Specialties",
            cell: (row) => <StringList items={row.specialties} maxVisible={3} />,
          },
          {
            header: "Years of Experience",
            cell: (row) => row.yearsOfExperience,
          },
          { 
            header: "Phone Number", 
            cell: (row) => formatPhoneNumber(row.phoneNumber) 
          },
        ]}
        getRowKey={(row) => row.id}
      />
    </main>
  );
}
