import { createTheme } from "@mantine/core";

const theme = createTheme({
    components: {
        Table: {
            styles: {
                th: {
                    fontWeight: 500,
                },
            },
        },
    },

});

export default theme;