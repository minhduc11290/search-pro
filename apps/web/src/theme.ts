import { createTheme } from "@mantine/core";

const theme = createTheme({
    fontFamily: "'Plus Jakarta Sans', 'Plus Jakarta Sans Fallback', Helvetica, Arial, sans- serif",
    components: {
        Table: {
            styles: {
                th: {
                    fontWeight: 500,
                },
            },
        },
    },
    breakpoints: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
    }

});

export default theme;