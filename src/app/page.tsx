"use client";

import { DataTable } from "@/components/DataTable";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { StringList } from "@/components/StringList";
import { Title } from "@/components/Title";
import { Advocate } from "@/db/schema";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaginationMetadata } from "./api/advocates/route";

const PAGE_SIZE = 10;

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMetadata>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Get starting page from URL parameters, default to 1 if invalid
  const getInitialPage = (): number => {
    const pageParam = searchParams.get("page");
    if (!pageParam) return 1;
    
    const page = parseInt(pageParam, 10);
    if (isNaN(page) || page < 1) return 1;
    
    return page;
  };

  const fetchAdvocates = (page: number) => {
    fetch(`/api/advocates?page=${page}&limit=${PAGE_SIZE}`)
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination);
        setCurrentPage(page);
      });
  };

  useEffect(() => {
    const initialPage = getInitialPage();
    fetchAdvocates(initialPage);
  }, []);

  // note that this filtering is done client-side (on the current page of data only)
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(term.toLowerCase()) ||
        advocate.lastName.toLowerCase().includes(term.toLowerCase()) ||
        advocate.city.toLowerCase().includes(term.toLowerCase()) ||
        advocate.degree.toLowerCase().includes(term.toLowerCase()) ||
        advocate.specialties.find(value => value.toLowerCase().includes(term.toLowerCase())) ||
        advocate.phoneNumber.toString().includes(term) ||
        advocate.yearsOfExperience.toString().includes(term)
      );
    });
    setFilteredAdvocates(filtered);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  const handlePageChange = (page: number) => {
    // Update URL with new page parameter
    router.push(`/?page=${page}`, { scroll: false });
    fetchAdvocates(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      {!searchTerm && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          hasNextPage={pagination.hasNextPage}
          hasPreviousPage={pagination.hasPreviousPage}
        />
      )}
    </main>
  );
}
