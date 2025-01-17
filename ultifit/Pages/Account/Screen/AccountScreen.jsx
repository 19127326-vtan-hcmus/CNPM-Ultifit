import React from 'react'
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image } from 'react-native';

import { useSelector, useDispatch } from 'react-redux'
import { addUser, deleteUser } from '../../../features/user/user'
import { genderSelectValue, activityLevelSelectValue } from '../../../../constants/selectInputValue';
import CustomButton from './../../../Components/CustomButton/CustomButton';
import { DateInput, Input, SelectInput } from './../../../Components/Input/Input';
import * as ImagePicker from 'expo-image-picker';
import { useForm } from "react-hook-form";
import { baseWideUrl, baseUrl } from '../../../../constants/url';
import axios from 'axios'
import { deleteFoods } from '../../../features/food/food';

export default function AccountScreen() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.user)

    const { handleSubmit, control, formState: { errors } } = useForm();
    const imgUrl = baseWideUrl + '/' + user.avatar
    const [image, setImage] = React.useState({
        uri: imgUrl
    })

    const onSubmit = (data) => {
        if (user?.username) {
            const dataSend = {
                data: { ...data },
                newAvatar: (image?.base64 ?? null)
            }

            try {
                axios.patch(`${baseUrl}/api/users/${user.username}`,
                    dataSend
                ).then((response) => {
                    const resData = response.data
                    console.log(resData)
                    dispatch(addUser(resData.message))
                })
            } catch (error) {
                console.log(error)
            }
        } else {

        }

    }

    React.useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
            base64: true,
        });

        if (!result.cancelled) {
            setImage(result);
        }
    };

    const handleLogout = () => {
        dispatch(deleteUser())
        dispatch(deleteFoods())
    }

    return (
        <SafeAreaView style={{ width: '100%', height: '100%', backgroundColor: 'white' }} >
            <ScrollView >
                <View style={{ ...styles.container, marginTop: 16 }}>
                    <View style={styles.loginInputContainer}>

                        <View style={{ ...styles.middleCol }}>
                            <View style={{ ...styles.middleRow, marginBottom: -15, }}>

                                <Image
                                    source={{ uri: image.uri }}
                                    style={{ width: 200, height: 200, borderRadius: 300 }}
                                    resizeMode={'cover'}
                                />

                            </View>
                            <CustomButton
                                title='Edit Avatar'
                                titleStyle={{ fontSize: 16 }}
                                containerStyle={{
                                    borderRadius: 16,
                                    borderColor: "#C1C1C1", borderWidth: 1,
                                    backgroundColor: 'white',
                                }}
                                width={150}
                                height={36}
                                onPress={() => pickImage()}
                            />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <Input name='name' title='Name' control={control} rules={{ required: 'This is required' }} errors={errors} defaultValue={user.name} />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <SelectInput name='gender' title='Gender' control={control} rules={{ required: 'This is required' }} errors={errors} values={genderSelectValue} initLable='What is your gender?' defaultValue={user.gender} />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <Input name='height' title='Height' control={control} keyboardType='numeric' rules={{ required: 'This is required', validate: (val) => !Number.isInteger(val) && val > 0 || 'Please enter positive number' }} errors={errors} defaultValue={user.height} />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <Input name='weight' title='Weight' control={control} keyboardType='numeric' rules={{ required: 'This is required', validate: (val) => !Number.isInteger(val) && val > 0 || 'Please enter positive number' }} errors={errors} defaultValue={user.weight} />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <SelectInput name='activityLevel' title='Activity' control={control} rules={{ required: 'This is required' }} errors={errors} values={activityLevelSelectValue} initLable='What is your Activity?' defaultValue={user.activityLevel} />
                        </View>

                        <View style={styles.loginInputWrapper} >
                            <DateInput name='DOB' title='Date of birth' control={control} rules={{ required: 'This is required', validate: (val) => val < Date.now() || 'Please check again' }} errors={errors} defaultValue={user.DOB} />
                        </View>

                    </View>

                    <View style={{ ...styles.middleRow, marginTop: 8, marginBottom: 0 }} >
                        <CustomButton
                            title='Change'
                            width={'80%'}
                            height={40}
                            onPress={handleSubmit(onSubmit)}
                            buttonStyle={{ borderColor: '#26ADFF', borderWidth: 1, borderRadius: 10 }}
                            titleStyle={{ color: '#26ADFF', fontSize: 16 }}
                        />
                    </View>

                    <View style={{ ...styles.middleRow, marginTop: 32, marginBottom: 0 }} >
                        <CustomButton
                            title='Change Password'
                            width={'80%'}
                            height={40}
                            onPress={() => console.log('none')}
                            buttonStyle={{ borderColor: '#C1C1C1', borderWidth: 1, borderRadius: 10 }}
                            titleStyle={{ color: '#6E6E6E', fontSize: 16 }}
                        />
                    </View>

                    <View style={{ ...styles.middleRow, marginTop: 12, marginBottom: 24 }} >
                        <CustomButton
                            title='Log out'
                            width={'80%'}
                            height={40}
                            onPress={() => handleLogout()}
                            buttonStyle={{ borderColor: '#F17F76', borderWidth: 1, borderRadius: 10 }}
                            titleStyle={{ color: '#F17F76', fontSize: 16 }}
                        />
                    </View>


                </View>
            </ScrollView>
        </SafeAreaView >
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },

    loginInput: {
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 5,
        borderColor: "#20232a",
        borderWidth: 1,
        width: '100%',
        marginBottom: 10,
    },

    loginButton: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginInputContainer: {
        width: '80%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    loginInputWrapper: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        width: '100%',
    },

    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C4E8FF',
        borderRadius: 12,
        height: 30,
        width: 70,
    },

    middleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    middleCol: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
