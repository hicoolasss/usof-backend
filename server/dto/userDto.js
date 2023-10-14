export default class UserDto {
    login;
    full_name
    email;
    is_email_verified
    profile_picture_path;
    rating;
    role;
    id;

    constructor(model) {
        this.login = model.login;
        this.full_name = model.full_name;
        this.email = model.email;
        this.is_email_verified = model.is_email_verified;
        this.profile_picture_path = model.profile_picture_path;
        this.rating = model.rating;
        this.role = model.role;
        this.id = model._id;
    }
}