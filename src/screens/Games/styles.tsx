import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

    container: {
        flex: 1,
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
        alignSelf: "center",
        fontSize: 12,
        fontWeight: "700",
        margin: 20,
        lineHeight: 30,
        color: "#333",
        textAlign: "center",
        bottom: 20
    },
    center: {
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    spaced: {
        marginTop: 20
    },
    italic: {
        fontStyle: "italic",
        textAlign: "center",
    },

});