"use client";

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModel from "@/hooks/useAuthModel";
import { useEffect } from "react";
import useInfoModel from "@/hooks/useInfoUploadModel";

const AuthModel = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext()
    const {onClose, isOpen} = useAuthModel();
    const infoModel = useInfoModel();

    useEffect(() => {
        if(session) {
            router.refresh();
            onClose();
        }
    }, [session, router, onClose])
    const onChange = (open: boolean) => {
        if(!open) {
            onClose()
        }
    }
    return(
        <Modal
        title="Welcome Back"
        description="Login to your account"
        isOpen={isOpen}
        onChange={onChange}
        >
            <Auth 
            theme="dark"
            magicLink
            providers={["github"]}
            supabaseClient={supabaseClient}
            localization={{
                variables: {
                    sign_in: {
                        email_label: "Your Outlook Mail ID",
                    }
                }
            }}
            appearance={{
                theme: ThemeSupa,
                variables: {
                    default: {
                        colors: {
                            brand: '#404040',
                            brandAccent: '#6366f1'
                        }
                    },
                }
            }}
            />
        </Modal>
    )
}

export default AuthModel