import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

/**
 * 🔐 BASİT SABİT GİRİŞ SİSTEMİ
 * Kullanıcı adı: glckals
 * Şifre: 1156
 *
 * Firebase tamamen kaldırıldı.
 * Uygulama localStorage ile çalışır.
 */

const STATIC_USERNAME = "glckals";
const STATIC_PASSWORD = "1156";

export default function IdeaOrganizerApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [newCategory, setNewCategory] = useState("");
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaText, setIdeaText] = useState("");

  // LocalStorage yükleme
  useEffect(() => {
    const saved = localStorage.getItem("ideas-data");
    if (saved) setCategories(JSON.parse(saved));
  }, []);

  // LocalStorage kaydetme
  useEffect(() => {
    localStorage.setItem("ideas-data", JSON.stringify(categories));
  }, [categories]);

  const login = () => {
    if (username === STATIC_USERNAME && password === STATIC_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Kullanıcı adı veya şifre yanlış");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories([...categories, { name: newCategory, ideas: [] }]);
    setNewCategory("");
  };

  const addIdea = () => {
    if (!ideaTitle || selectedCategory === null) return;

    const updated = [...categories];
    updated[selectedCategory].ideas.push({
      title: ideaTitle,
      text: ideaText
    });

    setCategories(updated);
    setIdeaTitle("");
    setIdeaText("");
  };

  if (!isAuthenticated) {
    return (
      <div className="p-10 max-w-md mx-auto">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Giriş Yap</h2>

          <Input
            placeholder="Kullanıcı Adı"
            className="mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            placeholder="Şifre"
            type="password"
            className="mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button onClick={login} className="w-full">
            Giriş
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Gizli Fikir Platformu</h1>
        <Button onClick={logout}>Çıkış</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Başlıklar</h2>

          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Yeni başlık"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={addCategory}>Ekle</Button>
          </div>

          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedCategory(i)}
              className={`p-2 rounded-xl cursor-pointer mb-2 border ${
                selectedCategory === i
                  ? "bg-black text-white"
                  : "bg-gray-100"
              }`}
            >
              {cat.name}
            </motion.div>
          ))}
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-2">Fikir Ekle</h2>

          <Input
            placeholder="Fikir başlığı"
            className="mb-2"
            value={ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
          />

          <Textarea
            placeholder="Detay"
            className="mb-2"
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
          />

          <Button onClick={addIdea}>Kaydet</Button>
        </Card>

        <Card className="p-4">
          <h2 className="font-semibold mb-2">Fikirler</h2>

          {selectedCategory !== null &&
            categories[selectedCategory]?.ideas?.map((idea, i) => (
              <div key={i} className="border rounded-xl p-3 mb-2">
                <h3 className="font-semibold">{idea.title}</h3>
                <p className="text-sm text-gray-600">{idea.text}</p>
              </div>
            ))}
        </Card>
      </div>
    </div>
  );
}

/**
 * ✅ TEST SENARYOLARI
 * 1. Yanlış kullanıcı adı → giriş yapmamalı
 * 2. Yanlış şifre → giriş yapmamalı
 * 3. Doğru bilgiler (glckals / 1156) → giriş yapmalı
 * 4. Başlık ekle → sayfa yenilenince kalmalı
 * 5. Fikir ekle → doğru kategoriye eklenmeli
 */
