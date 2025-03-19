import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const RadioButtons = (props) => {
    return (
        <TouchableOpacity onPress={() => props.setValue(props.lable)} style={{
            alignItems: "center",
            flexDirection: "row",

        }}>
            <View style={{
                alignContent: "center",
                alignItems: "center",
                borderWidth: props.value === props.lable ? 0 : 1,
                borderRadius: 8,
                width: 15,
                height: 15,
                backgroundColor: props.value === props.lable ? "lightgreen" : "white"
            }} />

            <Text style={{
                marginStart: 10,
                color: "black",
                fontSize: 16
            }}>
                {props.lable}
            </Text>
        </TouchableOpacity>
    )
}

export default RadioButtons