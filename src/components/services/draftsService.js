//to retrieve all requisition records
import axios from "axios";

const HOST = "http://localhost:4000";

//to retrive all drafts
export const getAllDrafts = async () => {
    try {
        const response = await axios.get(`${HOST}/draft/displayDraft`);
        console.log("dataaaaaaaa", response)
        return {
            ok: true,
            data: response.data
        }
    } catch (error) {
        return {
            ok: false
        }

    }
}

//to add a draft
export const addNewDraft = async (payload) => {
    console.log("data for draft", payload)
    try {
        await axios.post(`${HOST}/draft/addDraft`, payload)
        return {
            ok: true
        }
    } catch (error) {
        return {
            ok: false
        }
    }
}

//to update a draft

export const updateDraft = async (draftID, payload) => {
    try {
        await axios.put(`${HOST}/draft/updateDraft/${draftID}`, payload);
        return {
            ok: true,
        };
    } catch (error) {
        return {
            ok: false, err: error.response.data.status
        };
    }

}