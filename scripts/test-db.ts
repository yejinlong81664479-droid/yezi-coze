#!/usr/bin/env node

import { getDb } from "coze-coding-dev-sdk";
import { generations } from "../src/storage/database/shared/schema.js";

async function testDatabase() {
  console.log("测试数据库连接...");
  console.log("----------------------------------------");

  try {
    const db = await getDb();
    console.log("✅ 数据库连接成功");

    // 尝试查询
    const result = await db.select().from(generations).limit(5);
    console.log(`✅ 查询成功，找到 ${result.length} 条记录`);

    if (result.length > 0) {
      console.log("\n前几条记录：");
      result.slice(0, 3).forEach((r, i) => {
        console.log(`${i + 1}. ID: ${r.id}, Type: ${r.type}, Prompt: ${r.prompt.substring(0, 50)}...`);
      });
    }
  } catch (error) {
    console.error("❌ 数据库测试失败:", error);
    console.error("错误详情:", error.message);
    if (error.stack) {
      console.error("堆栈跟踪:", error.stack);
    }
  }
}

testDatabase();
