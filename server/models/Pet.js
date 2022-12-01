import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {
      name: {
          type: String,
          required: true,
      },
      imgUrl: {
          type: String,
      },
      bio: {
          type: String,
          maxLength: [
              150,
              '`{PATH}` Alanı (`{VALUE}`), `{MAXLENGTH}` Karakterden Az Olmalıdır'
          ],
      },
      sex: {
          type: String,
          enum: [ "Male", "Female" ]
      },
      birthDay: {
          type: Date,
      },
      kind: {
          type: String
      },
      species: {
          type: String,
          required: true
      },
      vaccinations: {
          type: Array,
          default: []
      },
      careGiverHistory: {
          type: Array,
          default: []
      },
      primaryOwner: {
          type: String,
          required: true
      },
      allOwners: {
          type: Array,
          default: []
      },
      handOverRecord: [
        {
            from: {
                type: String,
                required: true
            },
            to: {
                type: String,
                required: true
            },
            price: String,
            date: {
                type: Date,
                default: Date.now()
            }
        }
      ],
      savers: {
          type: Array,
          default: []
      },
  },
  {
      timestamps: true
  }
);

export default mongoose.model("Pet", PetSchema);