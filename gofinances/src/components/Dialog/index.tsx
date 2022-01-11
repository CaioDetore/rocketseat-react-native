import Dialog from "react-native-dialog";
import { DialogButtonProps } from "react-native-dialog/lib/Button";

interface Props {
    title: string;
    message: string;
    visible: boolean;
    cancel: () => void;
    confirm: () => void;
}

export function AlertDialog({ title, message, visible, cancel, confirm, ...rest } : Props){
    return (
        <Dialog.Container visible={visible}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>
                {message}
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={cancel} />
            <Dialog.Button label="Delete" onPress={confirm} />
        </Dialog.Container>
    )
};