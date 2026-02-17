#!/usr/bin/env node

/**
 * 监控内容生成进度
 */

import { getDb } from "coze-coding-dev-sdk";
import { generations } from "../src/storage/database/shared/schema.js";

async function monitorProgress() {
  console.log("========================================");
  console.log("  内容生成进度监控");
  console.log("========================================\n");

  try {
    const db = await getDb();
    const allGenerations = await db
      .select()
      .from(generations)
      .orderBy(generations.createdAt);

    // 统计各类型数量
    const pptCount = allGenerations.filter(g => g.type === "ppt" && g.imageUrls && g.imageUrls.length > 0).length;
    const comicCount = allGenerations.filter(g => g.type === "comic" && g.imageUrls && g.imageUrls.length > 0).length;
    const inProgress = allGenerations.filter(g => !g.imageUrls || g.imageUrls.length === 0).length;

    console.log("📊 总体统计");
    console.log("----------------------------------------");
    console.log(`✅ PPT 已完成: ${pptCount}/5`);
    console.log(`✅ 漫画 已完成: ${comicCount}/5`);
    console.log(`⏳ 进行中: ${inProgress}`);

    console.log("\n📋 最近生成的记录（最新10条）");
    console.log("----------------------------------------");

    const recent = allGenerations.slice(-10).reverse();
    recent.forEach((gen, index) => {
      const status = gen.imageUrls && gen.imageUrls.length > 0 ? "✅" : "⏳";
      const typeLabel = gen.type === "ppt" ? "PPT" : gen.type === "comic" ? "漫画" : gen.type;
      const imageCount = gen.imageUrls ? gen.imageUrls.length : 0;
      const time = new Date(gen.createdAt).toLocaleString("zh-CN");

      console.log(`\n${index + 1}. ${status} ${typeLabel}`);
      console.log(`   ID: ${gen.id}`);
      console.log(`   提示词: ${gen.prompt.substring(0, 50)}${gen.prompt.length > 50 ? "..." : ""}`);
      console.log(`   图片数: ${imageCount}`);
      console.log(`   时间: ${time}`);
    });

    console.log("\n========================================");
    console.log(`最后更新: ${new Date().toLocaleString("zh-CN")}`);
    console.log("========================================");

  } catch (error) {
    console.error("监控失败:", error);
  }
}

// 如果传入 --watch 参数，则持续监控
if (process.argv.includes("--watch")) {
  console.log("持续监控模式（每30秒刷新一次）");
  console.log("按 Ctrl+C 停止监控\n");

  const interval = setInterval(monitorProgress, 30000);
  monitorProgress(); // 立即执行一次

  process.on("SIGINT", () => {
    clearInterval(interval);
    console.log("\n\n监控已停止");
    process.exit(0);
  });
} else {
  monitorProgress();
}
