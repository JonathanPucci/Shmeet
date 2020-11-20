import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    text: {
        fontSize: 24,
        fontWeight: "700",
        margin: 20,
        lineHeight: 30,
        color: "#333",
        textAlign: "center",
    },
    textBottom: {
        fontSize: 12,
        fontWeight: "700",
        margin: 20,
        lineHeight: 30,
        color: "#333",
        textAlign: "center",
        position: "absolute",
        bottom: 20
    },
    center: {
        textAlign: "center",
    },
    italic: {
        fontStyle: "italic",
        textAlign: "center",
    },

});