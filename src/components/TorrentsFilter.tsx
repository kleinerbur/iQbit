import { Box, Button, Flex, FormControl, FormLabel, Input, LightMode, Select, useColorModeValue, UseDisclosureReturn } from "@chakra-ui/react"
import stateDictionary from "../utils/StateDictionary"
import { FilterHeading } from "./Filters"
import { useMemo } from "react"
import { useLocalStorage } from "usehooks-ts"
import { useQuery } from "react-query"
import { TorrClient } from "../utils/TorrClient"

const initialValues = {
  search: '',
  category: 'Show All',
  status: 'Show All'
}

export function useLocalFilters() {
  const [filterSearch, setFilterSearch] = useLocalStorage(
    "filter-search",
    initialValues.search
  )
  const [filterCategory, setFilterCategory] = useLocalStorage(
    "filter-category",
    initialValues.category
  )
  const [filterStatus, setFilterStatus] = useLocalStorage(
    "filter-status",
    initialValues.status
  )
  const indicator = useMemo(() => {
    let indicator = 0
    if (filterSearch !== initialValues.search) indicator++
    if (filterCategory !== initialValues.category) indicator++
    if (filterStatus !== initialValues.status) indicator++

    return indicator
  }, [filterSearch, filterCategory, filterStatus])

  return {
    indicator: indicator,
    search: {
      value: filterSearch,
      set: setFilterSearch
    },
    category: {
      value: filterCategory,
      set: setFilterCategory
    },
    status: {
      value: filterStatus,
      set: setFilterStatus
    },
    reset: () => {
      setFilterSearch(initialValues.search)
      setFilterCategory(initialValues.category)
      setFilterStatus(initialValues.status)
    }
  }
}

export function TorrentsFilter (props: {
  disclosure: UseDisclosureReturn
}) {
  const bgColor = useColorModeValue("white", "gray.900")

  const { data: categories } = useQuery(
    "torrentsCategory",
    TorrClient.getCategories
  )

  const Categories = useMemo(() => {
    return Object.values(categories || {}).map((c) => ({
      label: c.name,
      value: c.name,
    }))
  }, [categories])
  
  const filters = useLocalFilters()

  return (
    <Box bgColor={bgColor} rounded={"lg"} mb={5}>
      <FilterHeading
        indicator={filters.indicator}
        disclosure={props.disclosure}
      />
      {props.disclosure.isOpen && (
        <Flex flexDirection={"column"} gap={5} px={5} pb={5}>
          <FormControl>
            <FormLabel>Search</FormLabel>
            <Input
              value={filters.search.value}
              onChange={(e) => filters.search.set(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Category</FormLabel>
            <Select
              value={filters.category.value}
              onChange={(e) => filters.category.set(e.target.value)}
            >
              <option>Show All</option>
              {Categories.map((cat) => (
                <option key={cat.label}>{cat.label}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              value={filters.status.value}
              onChange={(e) => filters.status.set(e.target.value)}
            >
              <option>Show All</option>
              {Object.entries(stateDictionary).map(([key, data]) => (
                <option key={key} value={key}>
                  {data.short}
                </option>
              ))}
            </Select>
          </FormControl>
          <LightMode>
            <Button
              colorScheme={'blue'}
              onClick={filters.reset}
            >
              Reset Filters
            </Button>
          </LightMode>
        </Flex>
      )}
    </Box>
  )
}