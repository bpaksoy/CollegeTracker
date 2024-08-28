import { useState, useEffect } from "react";
import axios from "axios";

const apiKey = "9xLp3zg2RppFIwrtqazNg3XVL5hdMfjWn9U0Hd3I"
const fields = "school.name,id,school.state,school.ownership,school.ft_faculty_rate,latest.admissions.admission_rate.overall,latest.admissions.sat_scores.average.overall,latest.cost.attendance.academic_year";
const per_page = 10;

const useFetch = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const options = {
        method: "GET",
        url: `https://api.data.gov/ed/collegescorecard/v1/schools?api_key=${apiKey}&fields=${fields}&per_page=${per_page}`

    }

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.request(options);
            setData(response.data.results);
            setIsLoading(false);

        } catch {
            setError(error);
            alert("There is an error")

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()

    }, [])

    const refetch = () => {
        setIsLoading(true);
        fetchData();
    }
    return { data, isLoading, error, refetch };

}

export default useFetch;

