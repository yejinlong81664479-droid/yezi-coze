#!/usr/bin/env node

const BASE_URL = "http://localhost:5000";

async function testPPT() {
  console.log("测试PPT生成API...");
  console.log("----------------------------------------");

  try {
    const response = await fetch(`${BASE_URL}/api/generate/ppt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "这是一个测试PPT，关于人工智能的发展",
        pageCount: 3,
        style: "简洁专业",
      }),
    });

    console.log(`HTTP Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);

    const text = await response.text();
    console.log(`Response: ${text}`);

    try {
      const json = JSON.parse(text);
      console.log("\nParsed JSON:", JSON.stringify(json, null, 2));
    } catch (e) {
      console.log("\n无法解析为JSON");
    }
  } catch (error) {
    console.error("请求失败:", error);
  }
}

testPPT();
