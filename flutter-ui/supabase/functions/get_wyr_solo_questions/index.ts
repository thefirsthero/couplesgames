// functions/get_questions/index.ts
import { supabase } from "../_shared/supabase.ts";
import { User } from "https://esm.sh/@supabase/supabase-js@2.39.7"; // Adjust the path as per your setup

import { clientRequestHandlerWithUser } from "../_shared/request.ts"; // Adjust the path as per your setup

// Define the function to handle the request
clientRequestHandlerWithUser(async (req: Request, user: User) => {
    try {
        // Fetch questions from Supabase
        const { data, error } = await supabase
            .from('would_you_rather_solo')
            .select('id, option_a, votes_a, option_b, votes_b')
            .order('id', { ascending: true });

        if (error) {
            throw error;
        }

        // Return the questions data
        return new Response(JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching questions:', error.message);
        return new Response(JSON.stringify({ error: 'Failed to fetch questions' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
});
