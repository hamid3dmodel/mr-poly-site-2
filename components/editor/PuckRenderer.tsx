"use client";
import React from "react";
import { Render } from "@puckeditor/core";
import { puckConfig } from "./puck.config";

type Props = {
    data: any;
};

export default function PuckRenderer({ data }: Props) {
    // Render از @puckeditor/core حالا فقط در سمت کلاینت اجرا می‌شود
    return <Render config={puckConfig} data={data} />;
}