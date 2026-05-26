import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";

export default function NoteViewScreen() {
    const route = useRoute<any>();
    const note = route.params?.note;

    if (!note) return null;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <style>
            body { 
                font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif; 
                padding: 16px; 
                font-size: 16px; 
                color: #333; 
                background-color: #f5f5f5;
                line-height: 1.5;
            }
            h1 { font-size: 24px; margin-bottom: 4px; color: #111; }
            .date { color: #888; font-size: 14px; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
            .content { font-size: 16px; }
        </style>
    </head>
    <body>
        <h1>${note.title}</h1>
        <div class="date">${new Date(note.createdAt).toLocaleString()}</div>
        <div class="content">
            ${note.content}
        </div>
    </body>
    </html>
    `;

    return (
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <WebView
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                style={{ flex: 1, backgroundColor: "#f5f5f5" }}
            />
        </View>
    );
}
