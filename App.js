import React, { Component } from "react";
import { View, Text, Button } from "react-native";
import { Hoshi } from "react-native-textinput-effects";
import { validateAll } from "indicative/validator";
import Axios from "axios";

//config
import { styles } from "./config/styles";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      userData: "",
      error: {},
    };
  }

  registerUser = async (data) => {
    const rules = {
      name: "required|string",
      email: "required|email",
      password: "required|string|min:6|confirmed",
    };

    const messages = {
      required: (field) => `${field} is required`,
      "email.email": "The email syntax is wrong",
      "password.confirmed": "The password did not match",
      "password.min": "The password is too short",
    };

    try {
      await validateAll(data, rules, messages);
      const response = await Axios.post(
        "https://react-blog-api.bahdcasts.com/api/auth/register",
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );
      this.setState({
        userData: response,
      });
    } catch (errors) {
      console.log("----------------------", errors.response);
      const formattedErrors = {};
      if (errors.response && errors.response.status === 422) {
        formattedErrors["email"] = errors.response.data["email"][0];
        this.setState({
          error: formattedErrors,
        });
      } else {
        errors.forEach(
          (error) => (formattedErrors[error.field] = error.message)
        );
        this.setState({
          error: formattedErrors,
        });
      }
    }
  };

  render() {
    console.log("???????????????", this.state.error);
    return (
      <View style={styles.container}>
        <View style={styles.VC1_App}>
          <Text style={styles.h1}> Form Tutorial </Text>
        </View>
        <Hoshi
          style={styles.textInput}
          label={"Name"}
          borderColor={"purple"}
          borderHeight={3}
          inputPadding={16}
          backgroundColor={"white"}
          value={this.state.name}
          onChangeText={(name) => this.setState({ name })}
        />
        {this.state.error["name"] && (
          <Text style={styles.errorText}>{this.state.error["name"]}</Text>
        )}
        <Hoshi
          style={styles.textInput}
          label={"Email"}
          borderColor={"purple"}
          borderHeight={3}
          inputPadding={16}
          backgroundColor={"white"}
          value={this.state.email}
          onChangeText={(email) => this.setState({ email })}
        />
        {this.state.error["email"] && (
          <Text style={styles.errorText}>{this.state.error["email"]}</Text>
        )}
        <Hoshi
          style={styles.textInput}
          secureTextEntry
          label={"Password"}
          borderColor={"purple"}
          borderHeight={3}
          inputPadding={16}
          backgroundColor={"white"}
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}
        />
        {this.state.error["password"] && (
          <Text style={styles.errorText}>{this.state.error["password"]}</Text>
        )}
        <Hoshi
          style={styles.textInput}
          secureTextEntry
          label={"Reconfirm Password"}
          borderColor={"purple"}
          borderHeight={3}
          inputPadding={16}
          backgroundColor={"white"}
          value={this.state.password_confirmation}
          onChangeText={(password_confirmation) =>
            this.setState({ password_confirmation })
          }
        />
        <Button
          title="Register"
          onPress={() => this.registerUser(this.state)}
        />
      </View>
    );
  }
}
